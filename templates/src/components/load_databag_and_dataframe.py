import functools
import json

from kfp.v2.dsl import Artifact, Dataset, Output

from model_manager.databags import get_databag_by_id
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
    solution_id: str,
):
    handler = functools.partial(
        update_solution_error_status,
        solution_id,
    )
    with exception_handler(handler, StatusMessage.DATABAG_NOT_ACCESSIBLE):
        solution = update_solution_status(
            solution_id, StatusMessage.SOLUTION_CREATED
        )
        databag_model = get_databag_by_id(solution.databag_id)
        with open(databag.path, "w") as databag_file:
            json.dump(databag_model.to_dict(), databag_file)
        with open(dataframe.path, "wb") as dataframe_file:
            download_file(databag_model.dataframe_url, dataframe_file)
