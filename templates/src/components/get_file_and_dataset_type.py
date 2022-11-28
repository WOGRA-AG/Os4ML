import functools
import pathlib
from collections import namedtuple
from typing import NamedTuple

from exceptions.file_type_unknown import FileTypeUnknownException
from model_manager.databags import update_databag_status
from models.databag_type import DatasetType
from models.file_type import FileType
from models.status_message import StatusMessage
from util.exception_handler import exception_handler
from util.uri import is_uri


def get_file_and_dataset_type(
    databag_id: str,
) -> NamedTuple("Types", [("file_type", str), ("dataset_type", str)]):
    handler = functools.partial(
        update_databag_status,
        databag_id,
    )
    with exception_handler(handler, StatusMessage.FILE_TYPE_UNKNOWN):
        databag = update_databag_status(
            databag_id, StatusMessage.UPLOADING_DATA
        )
        types = namedtuple("Types", ["file_type", "dataset_type"])
        file_type = file_type_from_file_name(databag.file_name)
        dataset_type = dataset_type_from_file_name(databag.file_name)
        return types(file_type.value, dataset_type.value)


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


def dataset_type_from_file_name(file_name: str) -> DatasetType:
    if is_uri(file_name):
        return DatasetType.FILE_URL
    else:
        return DatasetType.LOCAL_FILE
