import functools

from kfp.v2.dsl import Dataset, Output

from exceptions.resource_not_found import ResourceNotFoundException
from model_manager.databags import (
    get_databag_by_id,
    get_dataset_download_url,
    update_databag_error_status,
)
from models.databag_type import DatasetType
from models.error_msg_key import ErrorMsgKey
from util.download import download_file
from util.exception_handler import exception_handler
from util.uri import resource_exists


def get_dataset(
    dataset_type: str,
    databag_id: str,
    os4ml_namespace: str,
    dataset: Output[Dataset],
):
    handler = functools.partial(
        update_databag_error_status,
        databag_id,
        os4ml_namespace=os4ml_namespace,
    )
    with exception_handler(handler, ErrorMsgKey.DATASET_COULD_NOT_BE_LOADED):
        databag = get_databag_by_id(databag_id, os4ml_namespace)
        if dataset_type == DatasetType.file_url:
            if not resource_exists(databag.file_name):
                raise ResourceNotFoundException(databag.file_name)
            download_url = databag.file_name
        else:
            download_url = get_dataset_download_url(databag, os4ml_namespace)
        with open(dataset.path, "wb") as output_file:
            download_file(download_url, output_file)
