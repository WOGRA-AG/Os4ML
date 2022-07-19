from typing import Dict

import requests

from src.objectstore.download import download_file
from src.objectstore.urls import (
    get_databag_url,
    get_download_url,
    put_databag_url,
)


def download_file_from_bucket(
    bucket: str, file_name: str, output_file_name: str, os4ml_namespace: str
) -> None:
    url = get_download_url(bucket, file_name, os4ml_namespace)
    with open(output_file_name, "wb") as output_file:
        download_file(url, output_file)


def download_databag_from_bucket(bucket: str, os4ml_namespace: str) -> Dict:
    url = get_databag_url(bucket, os4ml_namespace)
    response = requests.get(url)
    return response.json()


def put_databag(databag: Dict, bucket: str, os4ml_namespace: str):
    url = put_databag_url(bucket, os4ml_namespace)
    requests.put(url, json=databag)


def update_databag_status(bucket: str, status: str, os4ml_namespace: str, run_id: str = ""):
    databag = download_databag_from_bucket(bucket, os4ml_namespace)
    databag["status"] = status
    databag["run_id"] = run_id
    put_databag(databag, bucket, os4ml_namespace)


def error_databag_status_update(bucket: str, os4ml_namespace: str):
    update_databag_status(bucket, "error", os4ml_namespace)
