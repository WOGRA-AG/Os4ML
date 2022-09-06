import enum


class ErrorMsgKeys(str, enum.Enum):
    DEFAULT = "default"
    DATASET_NOT_FOUND = "dataset_not_found"
    DATASET_FORMAT_UNKNOWN = "dataset_format_unknown"
    DATASET_COULD_NOT_BE_READ = "dataset_could_not_be_read"
