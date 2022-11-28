import functools

from kfp.v2.dsl import Dataset, Output

from exceptions.resource_not_found import ResourceNotFoundException
from model_manager.databags import (
    get_databag_by_id,
    get_dataset_download_url,
    update_databag_status,
)
from models.databag_type import DatasetType
from models.status_message import StatusMessage
from util.download import download_file
from util.exception_handler import exception_handler
from util.uri import resource_exists


def get_dataset(
    dataset_type: str,
    databag_id: str,
    dataset: Output[Dataset],
):
    handler = functools.partial(
        update_databag_status,
        databag_id,
    )
    with exception_handler(handler, StatusMessage.DATASET_COULD_NOT_BE_LOADED):
        databag = get_databag_by_id(databag_id)
        if dataset_type == DatasetType.FILE_URL:
            if not resource_exists(databag.file_name):
                raise ResourceNotFoundException(databag.file_name)
            download_url = databag.file_name
        else:
            download_url = get_dataset_download_url(databag)
        with open(dataset.path, "wb") as output_file:
            download_file(download_url, output_file)
