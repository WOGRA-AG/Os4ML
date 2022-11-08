import functools
import json

from kfp.v2.dsl import Artifact, Dataset, Output

from model_manager.databags import (
    get_databag_by_id,
    get_dataframe_download_url,
)
from model_manager.solutions import (
    update_solution_error_status,
    update_solution_status,
)
from models.error_msg_key import ErrorMsgKey
from pipelines.util import StatusMessages
from util.download import download_file
from util.exception_handler import exception_handler


def load_databag_and_dataframe(
    dataframe_output: Output[Dataset],
    databag_output: Output[Artifact],
    databag_id: str,
    os4ml_namespace: str,
    solution_name: str,
):
    handler = functools.partial(
        update_solution_error_status,
        solution_name,
        os4ml_namespace=os4ml_namespace,
    )
    with exception_handler(handler, ErrorMsgKey.DATABAG_NOT_ACCESSIBLE):
        update_solution_status(
            solution_name, StatusMessages.created.value, os4ml_namespace
        )
        databag = get_databag_by_id(
            databag_id=databag_id, os4ml_namespace=os4ml_namespace
        )
        with open(databag_output.path, "w") as databag_file:
            json.dump(databag.to_dict(), databag_file)
        dataframe_url = get_dataframe_download_url(databag, os4ml_namespace)
        with open(dataframe_output.path, "wb") as dataframe_file:
            download_file(dataframe_url, dataframe_file)
