from __future__ import annotations

import enum
import pathlib


class FileType(str, enum.Enum):
    CSV = "csv"
    EXCEL = "excel"
    ZIP = "zip"

    @classmethod
    def from_file_name(cls, file_name: str) -> FileType:
        suffix = pathlib.Path(file_name).suffix
        if suffix == ".csv":
            return FileType.CSV
        elif suffix in (".xls", ".xlsx", ".xlsm", ".xlsb", ".odf", ".ods"):
            return FileType.EXCEL
        elif suffix == ".zip":
            return FileType.ZIP
        else:
            raise ValueError(f"Unknown file type: {suffix}")
