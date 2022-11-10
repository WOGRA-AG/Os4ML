from models.status_message import StatusMessage


class ResourceNotFoundException(Exception):
    error_status = StatusMessage.RESOURCE_NOT_FOUND

    def __init__(self, uri: str = None):
        if uri:
            message = f"Resource with uri {uri} not found"
        else:
            message = f"Resource not found"
        super().__init__(message)
