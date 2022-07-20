import json

from src.objectstore.objectstore import put_databag
from src.pipelines.util import DatabagStatusMessages
from src.util.error_handler import error_handler


@error_handler
def init_empty_databag(
    file_name: str,
    *,
    bucket: str = None,
    os4ml_namespace: str = "",
) -> str:
    databag_init = {
        "databag_name": file_name,
        "file_name": file_name,
        "bucket_name": bucket,
        "status": DatabagStatusMessages.uploading.value,
    }
    put_databag(databag_init, bucket, os4ml_namespace)
    return json.dumps(databag_init)
