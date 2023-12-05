from models.status_message import StatusMessage


class MissingFileInZipFile(Exception):
    error_status = StatusMessage.MISSING_FILE_IN_ZIP

    def __init__(self, file_name):
        self.file_name = file_name
