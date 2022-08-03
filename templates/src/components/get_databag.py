import json

from objectstore.objectstore import download_databag_from_bucket
from util.error_handler import error_handler


@error_handler
def get_databag(
    bucket: str, *, os4ml_namespace: str = "", solution_name: str = ""
) -> str:
    """Download the databag json file from the minio bucket and return is as a string."""
    databag = download_databag_from_bucket(bucket, os4ml_namespace)
    return json.dumps(databag.to_dict())
