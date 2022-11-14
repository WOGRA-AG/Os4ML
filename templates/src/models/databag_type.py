import enum


class DatasetType(str, enum.Enum):
    local_file = "local_file"
    file_url = "file_url"
