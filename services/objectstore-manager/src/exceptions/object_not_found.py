class ObjectNotFoundException(Exception):
    def __init__(self, bucket_name: str, object_name: str):
        self.message = f"Object with name {object_name} not found in bucket with name {bucket_name}"
