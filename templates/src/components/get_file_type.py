import functools
import pathlib
from urllib.parse import urlparse

from exceptions.file_type_unknown import FileTypeUnknownException
from model_manager.databags import update_databag_status
from models.databag_type import DatabagType
from models.file_type import FileType
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


def get_file_name_from_url(url: str) -> str:
    url_path = urlparse(url).path
    path = pathlib.Path(url_path)
    return path.name


def file_type_from_file_name(file_name: str) -> FileType:
    suffix = pathlib.Path(file_name).suffix
    if suffix == ".csv":
        return FileType.CSV
    elif suffix in (".xls", ".xlsx", ".xlsm", ".xlsb", ".odf", ".ods"):
        return FileType.EXCEL
    elif suffix == ".zip":
        return FileType.ZIP
    elif suffix == ".py":
        return FileType.SCRIPT
    else:
        raise FileTypeUnknownException(f"Unknown file type: {suffix}")
