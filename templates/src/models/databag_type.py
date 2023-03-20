import enum


class DatabagType(str, enum.Enum):
    LOCAL_FILE = "local_file"
    FILE_URL = "file_url"
