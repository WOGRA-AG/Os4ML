from models.status_message import StatusMessage


class DataFileNotFoundException(Exception):
    error_status = StatusMessage.DATA_FILE_NOT_FOUND


class TooManyDataFilesException(Exception):
    error_status = StatusMessage.TOO_MANY_DATA_FILES
