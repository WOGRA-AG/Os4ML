from models.status_message import StatusMessage


class FileTypeUnknownException(ValueError):
    error_status = StatusMessage.FILE_TYPE_UNKNOWN


class FileTypeNotSupported(ValueError):
    error_status = StatusMessage.FILE_TYPE_NOT_SUPPORTED
