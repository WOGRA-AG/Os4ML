import json

from jobmanager.solution import status_update
from objectstore.objectstore import download_databag_by_id
from pipelines.util import StatusMessages
from util.error_handler import error_handler


@error_handler()
def get_databag(
    databag_id: str, *, os4ml_namespace: str = "", solution_name: str = ""
) -> str:
    """Download the databag json file from the minio bucket and return is as a string."""
    status_update(solution_name, StatusMessages.created.value, os4ml_namespace)
    databag = download_databag_by_id(
        databag_id=databag_id, os4ml_namespace=os4ml_namespace
    )
    return json.dumps(databag.to_dict())
