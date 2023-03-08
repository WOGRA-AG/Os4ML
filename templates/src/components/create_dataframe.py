import functools

from kfp.v2.dsl import Dataset, Input, Output

from load.dataframe import create_df, save_dataframe
from model_manager.databags import update_databag_status
from models.status_message import StatusMessage
from util.exception_handler import exception_handler


def create_dataframe(
    dataset: Input[Dataset],
    dataframe: Output[Dataset],
    file_type: str,
    databag_id: str,
):
    handler = functools.partial(
        update_databag_status,
        databag_id,
    )
    with exception_handler(handler, StatusMessage.DATASET_COULD_NOT_BE_READ):
        df = create_df(file_type, dataset.path)
        save_dataframe(df, dataframe.path)
