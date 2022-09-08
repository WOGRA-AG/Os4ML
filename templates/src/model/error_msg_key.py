import enum


class ErrorMsgKey(str, enum.Enum):
    DEFAULT = "default"
    DATABAG_NOT_ACCESSIBLE = "databag_not_accessible"
    DATABAG_COULD_NOT_BE_CREATED = "databag_could_not_be_created"
    DATASET_NOT_FOUND = "dataset_not_found"
    DATASET_FORMAT_UNKNOWN = "dataset_format_unknown"
    DATASET_COULD_NOT_BE_READ = "dataset_could_not_be_read"
    METRICS_NOT_RETRIEVABLE = "metrics_not_retrievable"
    TRAINING_FAILED = "training_failed"
    FILE_TYPE_UNKNOWN = "file_type_unknown"
