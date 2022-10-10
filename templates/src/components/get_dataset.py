import functools

from kfp.v2.dsl import Dataset, Output

from exceptions.resource_not_found import ResourceNotFoundException
from model.databag_type import DatasetType
from model.error_msg_key import ErrorMsgKey
from objectstore.objectstore import (
    download_file,
    error_databag_status_update,
    get_download_url,
)
from util.exception_handler import exception_handler
from util.uri import resource_exists


def get_dataset(
    dataset_type: str,
    file_name: str,
    bucket: str,
    databag_id: str,
    os4ml_namespace: str,
    dataset: Output[Dataset],
):
    handler = functools.partial(
        error_databag_status_update,
        databag_id,
        os4ml_namespace=os4ml_namespace,
    )
    with exception_handler(handler, ErrorMsgKey.DATASET_COULD_NOT_BE_LOADED):
        with open(dataset.path, "wb") as output_file:
            if dataset_type == DatasetType.file_url:
                if not resource_exists(file_name):
                    raise ResourceNotFoundException(file_name)
                download_url = file_name
            else:
                download_url = get_download_url(
                    bucket, f"{databag_id}/{file_name}", os4ml_namespace
                )
            download_file(download_url, output_file)
