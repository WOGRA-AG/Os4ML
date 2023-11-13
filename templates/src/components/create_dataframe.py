import functools
import tempfile

import pandas as pd

from build.model_manager_client.model.databag import Databag
from load.dataframe import build_dataframe, save_dataframe
from model_manager.databags import (
    get_databag_by_id,
    update_databag,
    update_databag_status,
    upload_dataframe,
)
from models.status_message import StatusMessage
from sniffle.sniffle import create_columns_of_databag, get_num_rows
from util.exception_handler import exception_handler


def create_dataframe(
    file_type: str,
    databag_id: str,
    max_categories: int,
):
    handler = functools.partial(
        update_databag_status,
        databag_id,
    )
    with exception_handler(handler, StatusMessage.DATASET_COULD_NOT_BE_READ):
        databag = get_databag_by_id(databag_id)
        df, zip_file = build_dataframe(databag, file_type)
        upload_dataframe_to_databag(df, databag)
        update_databag_status(databag_id, StatusMessage.INSPECTING_DATATYPES)
        columns = create_columns_of_databag(df, max_categories, zip_file)
        databag.number_rows = get_num_rows(columns)
        databag.number_columns = len(columns)
        databag.columns = columns
        databag.status = StatusMessage.DATABAG_DONE.value
        update_databag(databag, completed=True)


def upload_dataframe_to_databag(df: pd.DataFrame, databag: Databag) -> None:
    with tempfile.NamedTemporaryFile() as file:
        save_dataframe(df, file.name)
        with open(file.name, "rb") as upload_file:
            upload_dataframe(upload_file, databag)
