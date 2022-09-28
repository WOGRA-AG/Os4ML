import enum


class FileType(str, enum.Enum):
    CSV = "csv"
    EXCEL = "excel"
    ZIP = "zip"
    SCRIPT = "script"
