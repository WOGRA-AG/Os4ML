from typing import BinaryIO

import requests

from build.objectstore.model.databag import Databag
from util.init_objectstore_client import init_objectstore_client


def download_file_from_bucket(
    bucket: str, file_name: str, output_file_name: str, os4ml_namespace: str
) -> None:
    url = get_download_url(bucket, file_name, os4ml_namespace)
    with open(output_file_name, "wb") as output_file:
        download_file(url, output_file)


def download_databag_from_bucket(bucket: str, os4ml_namespace: str) -> Databag:
    objectstore = init_objectstore_client(os4ml_namespace)
    return objectstore.get_databag_by_bucket_name(bucket)


def put_databag(databag: Databag, bucket: str, os4ml_namespace: str):
    objectstore = init_objectstore_client(os4ml_namespace)
    objectstore.put_databag_by_bucket_name(bucket, databag=databag)


def update_databag_status(bucket: str, status: str, os4ml_namespace: str):
    objectstore = init_objectstore_client(os4ml_namespace)
    databag = objectstore.get_databag_by_bucket_name(bucket)
    databag.status = status
    objectstore.put_databag_by_bucket_name(bucket, databag=databag)


def error_databag_status_update(bucket: str, os4ml_namespace: str):
    update_databag_status(bucket, "error", os4ml_namespace)


def download_file(url: str, output_file: BinaryIO, chunk_size=128) -> None:
    response = requests.get(url, stream=True)
    for chunk in response.iter_content(chunk_size=chunk_size):
        output_file.write(chunk)


def get_download_url(bucket: str, file_name: str, os4ml_namespace: str) -> str:
    base_server_url = _get_base_server_url(os4ml_namespace)
    return f"{base_server_url}/apis/v1beta1/objectstore/{bucket}/object?objectName={file_name}"


def _get_base_server_url(os4ml_namespace: str) -> str:
    return (
        f"http://objectstore-manager.{os4ml_namespace}.svc.cluster.local:8000"
    )
