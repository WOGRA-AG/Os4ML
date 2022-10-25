class FileNotReadableException(Exception):
    def __init__(self, path: str = None, err: str = None):
        self.message = f"Error while reading PipelineTemplate file at {path}. Thrown exception is: {err}"
