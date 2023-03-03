import functools

from kfp.v2.dsl import Dataset, Output

from model_manager.databags import get_databag_by_id, update_databag_status
from models.status_message import StatusMessage
from util.download import download_file
from util.exception_handler import exception_handler


def get_dataset(
    databag_id: str,
    dataset: Output[Dataset],
):
    handler = functools.partial(
        update_databag_status,
        databag_id,
    )
    with exception_handler(handler, StatusMessage.DATASET_COULD_NOT_BE_LOADED):
        databag = get_databag_by_id(databag_id)
        with open(dataset.path, "wb") as output_file:
            download_file(databag.dataset_url, output_file)
