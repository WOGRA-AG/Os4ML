import json

from build.objectstore.model.databag import Databag
from objectstore.objectstore import put_databag
from pipelines.util import DatabagStatusMessages
from util.error_handler import error_handler


@error_handler
def init_empty_databag(
    file_name: str,
    run_id: str = "",
    *,
    bucket: str = None,
    os4ml_namespace: str = "",
) -> str:
    databag = Databag(
        databag_name=file_name,
        file_name=file_name,
        bucket_name=bucket,
        status=DatabagStatusMessages.uploading.value,
        run_id=run_id,
    )
    put_databag(databag, bucket, os4ml_namespace)
    return json.dumps(databag.to_dict())
