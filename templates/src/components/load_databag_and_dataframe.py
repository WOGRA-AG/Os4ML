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
from models.status_message import StatusMessage
from util.download import download_file
from util.exception_handler import exception_handler


def load_databag_and_dataframe(
    dataframe: Output[Dataset],
    databag: Output[Artifact],
    databag_id: str,
    solution_id: str,
):
    handler = functools.partial(
        update_solution_error_status,
        solution_id,
    )
    with exception_handler(handler, StatusMessage.DATABAG_NOT_ACCESSIBLE):
        update_solution_status(solution_id, StatusMessage.SOLUTION_CREATED)
        databag_model = get_databag_by_id(databag_id)
        with open(databag.path, "w") as databag_file:
            json.dump(databag_model.to_dict(), databag_file)
        dataframe_url = get_dataframe_download_url(databag_model)
        with open(dataframe.path, "wb") as dataframe_file:
            download_file(dataframe_url, dataframe_file)
