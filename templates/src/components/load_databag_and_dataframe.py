import functools
import json

from kfp.v2.dsl import Artifact, Dataset, Output

from config import DATASET_FILE_NAME
from jobmanager.solution import error_status_update, status_update
from model.error_msg_key import ErrorMsgKey
from objectstore.objectstore import (
    download_file_from_databag, get_databag_by_id,
)
from pipelines.util import StatusMessages
from util.exception_handler import exception_handler


def load_databag_and_dataframe(
    dataframe: Output[Dataset],
    databag: Output[Artifact],
    databag_id: str,
    os4ml_namespace: str,
    solution_name: str,
):
    handler = functools.partial(
        error_status_update, solution_name, os4ml_namespace=os4ml_namespace
    )
    with exception_handler(handler, ErrorMsgKey.DATABAG_NOT_ACCESSIBLE):
        status_update(
            solution_name, StatusMessages.created.value, os4ml_namespace
        )
        bag = get_databag_by_id(
            databag_id=databag_id, os4ml_namespace=os4ml_namespace
        )
        with open(databag.path, "w") as databag_output:
            json.dump(bag.to_dict(), databag_output)
        download_file_from_databag(
            bag, DATASET_FILE_NAME, bag.bucket, dataframe.path, os4ml_namespace
        )
