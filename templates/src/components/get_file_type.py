import functools

from load.dataset import get_dataset_file_type
from model_manager.databags import update_databag_status
from models.status_message import StatusMessage
from util.exception_handler import exception_handler


def get_file_type(
    databag_id: str,
) -> str:
    handler = functools.partial(
        update_databag_status,
        databag_id,
    )
    with exception_handler(handler, StatusMessage.FILE_TYPE_UNKNOWN):
        databag = update_databag_status(databag_id, StatusMessage.LOADING_DATA)
        return get_dataset_file_type(databag).value
