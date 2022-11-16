class BucketNotFoundException(Exception):
    def __init__(self, bucket_name: str):
        self.message = f"Bucket with name {bucket_name} not found"
