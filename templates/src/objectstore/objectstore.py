from typing import BinaryIO

import requests

from build.objectstore.model.databag import Databag
from model.error_msg_key import ErrorMsgKey
from util.init_objectstore_client import init_objectstore_client


def download_file_from_databag(
    databag: Databag,
    file_name: str,
    bucket: str,
    output_file_name: str,
    os4ml_namespace: str,
) -> None:
    url = get_download_url(
        bucket, f"{databag.databag_id}/{file_name}", os4ml_namespace
    )
    with open(output_file_name, "wb") as output_file:
        download_file(url, output_file)


def download_databag_by_id(databag_id: str, os4ml_namespace: str) -> Databag:
    objectstore = init_objectstore_client(os4ml_namespace)
    return objectstore.get_databag_by_id(databag_id=databag_id)


def put_databag(databag: Databag, os4ml_namespace: str):
    objectstore = init_objectstore_client(os4ml_namespace)
    objectstore.put_databag_by_id(
        databag_id=databag.databag_id, databag=databag
    )


def update_databag_status(databag_id: str, status: str, os4ml_namespace: str):
    objectstore = init_objectstore_client(os4ml_namespace)
    databag = objectstore.get_databag_by_id(databag_id=databag_id)
    databag.status = status
    objectstore.put_databag_by_id(databag_id=databag_id, databag=databag)


def error_databag_status_update(
    databag_id: str, error_msg_key: ErrorMsgKey, os4ml_namespace: str
):
    objectstore = init_objectstore_client(os4ml_namespace)
    databag = objectstore.get_databag_by_id(databag_id=databag_id)
    databag.status = "error"
    databag.error_msg_key = error_msg_key.value
    objectstore.put_databag_by_id(databag_id=databag_id, databag=databag)


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


def upload_file_to_databag(
    file: BinaryIO, file_name: str, databag: Databag, os4ml_namespace: str
) -> None:
    objectstore = init_objectstore_client(os4ml_namespace)
    objectstore.put_dataset_by_databag_id(
        databag.databag_id, file_name, body=file
    )
