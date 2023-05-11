import functools

from kfp.v2.dsl import Dataset, Output

from load.dataframe import build_dataframe, save_dataframe
from model_manager.databags import get_databag_by_id, update_databag_status
from models.status_message import StatusMessage
from util.exception_handler import exception_handler


def create_dataframe(
    dataframe: Output[Dataset],
    file_type: str,
    databag_id: str,
):
    handler = functools.partial(
        update_databag_status,
        databag_id,
    )
    with exception_handler(handler, StatusMessage.DATASET_COULD_NOT_BE_READ):
        databag = get_databag_by_id(databag_id)
        df = build_dataframe(databag.dataset_url, file_type)
        save_dataframe(df, dataframe.path)
