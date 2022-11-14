from models.error_msg_key import ErrorMsgKey


class FileTypeUnknownException(ValueError):
    error_msg_key = ErrorMsgKey.FILE_TYPE_UNKNOWN
