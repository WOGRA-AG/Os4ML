from __future__ import annotations

import enum
import pathlib

from model.error_msg_key import ErrorMsgKey


class FileTypeUnknownError(ValueError):
    error_msg_key = ErrorMsgKey.FILE_TYPE_UNKNOWN


class FileType(str, enum.Enum):
    CSV = "csv"
    EXCEL = "excel"
    ZIP = "zip"
    SCRIPT = "script"

    @classmethod
    def from_file_name(cls, file_name: str) -> FileType:
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
            raise FileTypeUnknownError(f"Unknown file type: {suffix}")
