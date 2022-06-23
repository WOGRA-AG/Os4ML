from typing import Dict

import requests

from src.objectstore.download import download_file


def download_file_from_bucket(
    bucket: str, file_name: str, output_file_name: str
) -> None:
    url = f"http://os4ml-objectstore-manager.os4ml:8000/apis/v1beta1/objectstore/{bucket}/object?object_name={file_name}"
    with open(output_file_name, "wb") as output_file:
        download_file(url, output_file)


def download_databag_from_bucket(bucket: str) -> Dict:
    url = f"http://os4ml-objectstore-manager.os4ml:8000/apis/v1beta1/objectstore/databag/{bucket}"
    response = requests.get(url)
    return response.json()


def put_databag(databag: Dict, bucket: str):
    url = f"http://os4ml-objectstore-manager.os4ml:8000/apis/v1beta1/objectstore/databag/{bucket}"
    requests.put(url, json=databag)
