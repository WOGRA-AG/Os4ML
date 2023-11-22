import functools
import tempfile

from kfp.v2.dsl import Dataset, Output

from file_type.file_type import file_type_from_file_name
from load.dataframe import read_df, save_dataframe
from model_manager.predictions import (
    download_prediction_data,
    get_prediction_by_id,
    update_prediction_status,
)
from models.status_message import StatusMessage
from util.exception_handler import exception_handler


def load_prediction_data(
    prediction_id: str,
    prediction_data: Output[Dataset],
):
    handler = functools.partial(
        update_prediction_status, prediction_id, completed=True
    )
    with exception_handler(
        handler, StatusMessage.LOADING_PREDICTION_DATA_FAILED
    ):
        prediction = get_prediction_by_id(prediction_id)
        with tempfile.NamedTemporaryFile() as tmp_file:
            with open(tmp_file.name, "wb") as file:
                download_prediction_data(file, prediction_id)
            file_type = file_type_from_file_name(prediction.data_file_name)
            df, _ = read_df(file_type, tmp_file.name)
            save_dataframe(df, prediction_data.path)
