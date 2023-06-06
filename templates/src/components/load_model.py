import functools

from kfp.v2.dsl import Artifact, Output

from model_manager.predictions import update_prediction_status
from model_manager.solutions import download_model, get_solution_by_id
from models.status_message import StatusMessage
from util.exception_handler import exception_handler


def load_model(
    prediction_id: str,
    model: Output[Artifact],
):
    handler = functools.partial(
        update_prediction_status, prediction_id, completed=True
    )
    with exception_handler(handler, StatusMessage.LOADING_MODEL_FAILED):
        prediction = update_prediction_status(
            prediction_id, StatusMessage.LOADING_MODEL
        )
        solution = get_solution_by_id(prediction.solution_id)
        with open(model.path, "wb") as model_file:
            download_model(model_file, solution.id)
