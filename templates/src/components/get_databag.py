import functools
import json

from jobmanager.solution import error_status_update, status_update
from model.error_msg_key import ErrorMsgKey
from objectstore.objectstore import download_databag_by_id
from pipelines.util import StatusMessages
from util.exception_handler import exception_handler


def get_databag(
    databag_id: str, solution_name: str, os4ml_namespace: str
) -> str:
    """Get the databag and return is as a json string."""
    handler = functools.partial(
        error_status_update, solution_name, os4ml_namespace=os4ml_namespace
    )
    with exception_handler(handler, ErrorMsgKey.DATABAG_NOT_ACCESSIBLE):
        status_update(
            solution_name, StatusMessages.created.value, os4ml_namespace
        )
        databag = download_databag_by_id(
            databag_id=databag_id, os4ml_namespace=os4ml_namespace
        )
        return json.dumps(databag.to_dict())
