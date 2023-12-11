import functools
import tempfile

from file_type.file_type import file_type_from_file_name
from load.dataframe import read_df
from ludwig_model.predict import (
    combine_data_and_result,
    load_model,
    predict_data,
)
from model_manager.predictions import (
    download_prediction_data,
    get_prediction_by_id,
    update_prediction_status,
    upload_prediction_result,
)
from model_manager.solutions import download_model, get_solution_by_id
from models.status_message import StatusMessage
from util.exception_handler import exception_handler


def predict(
    prediction_id: str,
):
    handler = functools.partial(
        update_prediction_status, prediction_id, completed=True
    )
    with exception_handler(handler, StatusMessage.PREDICTING_FAILED):
        prediction = update_prediction_status(
            prediction_id, StatusMessage.PREDICTING
        )
        solution = get_solution_by_id(prediction.solution_id)
        with tempfile.NamedTemporaryFile() as prediction_data_file:
            with open(prediction_data_file.name, "wb") as f:
                download_prediction_data(f, prediction_id)
            file_type = file_type_from_file_name(prediction.data_file_name)
            df, zip_file = read_df(file_type, prediction_data_file.name)
        if zip_file is not None:
            zip_file.extractall()
        with tempfile.NamedTemporaryFile() as model_file:
            with open(model_file.name, "wb") as f:
                download_model(f, solution.id)
            ludwig_model = load_model(model_file.name)
            result_df = predict_data(ludwig_model, df)
        combined_df = combine_data_and_result(
            df, result_df, solution.output_fields
        )
        with tempfile.NamedTemporaryFile() as file:
            combined_df.to_csv(file.name, index=False)
            with open(file.name, "rb") as result_file:
                upload_prediction_result(result_file, prediction_id)
        update_prediction_status(
            prediction_id, StatusMessage.PREDICTION_DONE, completed=True
        )
