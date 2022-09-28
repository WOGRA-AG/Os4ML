class ResourceNotFoundException(Exception):
    def __init__(self, uri: str = None):
        if uri:
            message = f"Resource with uri {uri} not found"
        else:
            message = f"Resource not found"
        super().__init__(message)
