from datetime import datetime
from typing import IO

from build.model_manager_client.model.prediction import Prediction
from config import DATE_FORMAT_STR, USER_TOKEN
from model_manager.init_api_client import model_manager
from models.status_message import StatusMessage
from util.upload import put_file_to_url


def get_prediction_by_id(prediction_id: str) -> Prediction:
    return model_manager.get_prediction_by_id(
        prediction_id, usertoken=USER_TOKEN
    )


def update_prediction_status(
    prediction_id: str, status: StatusMessage, completed=False
) -> Prediction:
    prediction = get_prediction_by_id(prediction_id)
    prediction.status = status.value
    if completed:
        prediction.completion_time = datetime.utcnow().strftime(
            DATE_FORMAT_STR
        )
    return model_manager.update_prediction_by_id(
        prediction_id, prediction=prediction, usertoken=USER_TOKEN
    )


def upload_prediction_result(result: IO[bytes], prediction_id: str) -> None:
    url = model_manager.get_prediction_result_put_url(
        prediction_id, usertoken=USER_TOKEN
    )
    put_file_to_url(url, result)
