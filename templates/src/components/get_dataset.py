import functools

from kfp.v2.dsl import Dataset, Output

from exceptions.resource_not_found import ResourceNotFoundException
from model.databag_type import DatasetType
from model.error_msg_key import ErrorMsgKey
from objectstore.objectstore import (
    download_file,
    error_databag_status_update,
    get_download_url, get_databag_by_id,
)
from util.exception_handler import exception_handler
from util.uri import resource_exists


def get_dataset(
    dataset_type: str,
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
        databag = get_databag_by_id(databag_id, os4ml_namespace)
        with open(dataset.path, "wb") as output_file:
            if dataset_type == DatasetType.file_url:
                if not resource_exists(databag.file_name):
                    raise ResourceNotFoundException(databag.file_name)
                download_url = databag.file_name
            else:
                download_url = get_download_url(
                    databag.bucket, f"{databag_id}/{databag.file_name}", os4ml_namespace
                )
            download_file(download_url, output_file)
