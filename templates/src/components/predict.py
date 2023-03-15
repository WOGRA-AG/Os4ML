import functools
import tempfile

from kfp.v2.dsl import Artifact, Dataset, Input

from load.dataframe import load_dataframe
from ludwig_model.predict import (
    combine_data_and_result,
    load_model,
    predict_data,
)
from model_manager.predictions import (
    update_prediction_status,
    upload_prediction_result,
)
from model_manager.solutions import get_solution_by_id
from models.status_message import StatusMessage
from util.exception_handler import exception_handler


def predict(
    prediction_id: str,
    model: Input[Artifact],
    prediction_data: Input[Dataset],
):
    handler = functools.partial(
        update_prediction_status, prediction_id, completed=True
    )
    with exception_handler(handler, StatusMessage.PREDICTING_FAILED):
        prediction = update_prediction_status(
            prediction_id, StatusMessage.PREDICTING
        )
        solution = get_solution_by_id(prediction.solution_id)
        df = load_dataframe(prediction_data.path)
        ludwig_model = load_model(model.path)
        result_df = predict_data(ludwig_model, df)
        combined_df = combine_data_and_result(
            df, result_df, solution.output_fields
        )
        with tempfile.NamedTemporaryFile() as file:
            combined_df.to_csv(file.name, index=False)
            with open(file.name, "rb") as result_file:
                upload_prediction_result(result_file, prediction_id)
        update_prediction_status(prediction_id, StatusMessage.PREDICTION_DONE)
