from src.objectstore.objectstore import download_databag_from_bucket
from src.util.error_handler import error_handler
from src.util.json_util import snake_case_json_dumps


@error_handler
def get_databag(bucket: str, *, solution_name: str = None) -> str:
    """Download the databag json file from the minio bucket and return is as a string."""
    databag = download_databag_from_bucket(bucket)
    return snake_case_json_dumps(databag)
