import functools
import tempfile

from kfp.v2.dsl import Dataset, Input

from load.dataframe import load_dataframe
from model_manager.solutions import (
    get_solution_by_id,
    update_solution_error_status,
    upload_prediction_template,
)
from models.status_message import StatusMessage
from util.exception_handler import exception_handler


def create_prediction_template(dataframe: Input[Dataset], solution_id: str):
    handler = functools.partial(
        update_solution_error_status,
        solution_id,
    )
    with exception_handler(
        handler, StatusMessage.PREDICTION_TEMPLATE_COULD_NOT_BE_CREATED
    ):
        df = load_dataframe(dataframe.path)
        solution = get_solution_by_id(solution_id)

        for output_field in solution.output_fields:
            df = df.drop(output_field, axis=1)
        df = df[0:10]

        with tempfile.NamedTemporaryFile() as tmp_file:
            df.to_csv(tmp_file.name, index=False)
            with open(tmp_file.name, "rb") as file:
                upload_prediction_template(file, solution_id)
