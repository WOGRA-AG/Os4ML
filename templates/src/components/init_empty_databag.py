import functools
import json

from build.objectstore.model.databag import Databag
from model.error_msg_key import ErrorMsgKey
from objectstore.objectstore import error_databag_status_update, put_databag
from pipelines.util import DatabagStatusMessages
from util.exception_handler import exception_handler
from util.uri import extract_filename_from_uri, is_uri


def init_empty_databag(
    file_name: str,
    bucket: str,
    databag_id: str,
    run_id: str,
    os4ml_namespace: str,
) -> str:
    handler = functools.partial(
        error_databag_status_update,
        databag_id,
        os4ml_namespace=os4ml_namespace,
    )
    with exception_handler(handler, ErrorMsgKey.DATABAG_COULD_NOT_BE_CREATED):
        databag_name = (
            extract_filename_from_uri(file_name)
            if is_uri(file_name)
            else file_name
        )
        databag = Databag(
            databag_name=databag_name,
            file_name=file_name,
            bucket_name=bucket,
            databag_id=databag_id,
            status=DatabagStatusMessages.uploading.value,
            run_id=run_id,
        )
        put_databag(databag, os4ml_namespace)
        return json.dumps(databag.to_dict())
