import functools

from file_type.file_type import (
    file_type_from_file_name,
    get_file_name_from_url,
)
from model_manager.databags import update_databag_status
from models.databag_type import DatabagType
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
        file_name = databag.file_name
        if databag.databag_type == DatabagType.FILE_URL:
            file_name = get_file_name_from_url(databag.dataset_url)
        return file_type_from_file_name(file_name).value
