import pathlib
from urllib.parse import urlparse

from exceptions.file_type_unknown import FileTypeUnknownException
from models.file_type import FileType


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
