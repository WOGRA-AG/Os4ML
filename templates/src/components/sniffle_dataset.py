import functools
import tempfile
from typing import List

import pandas as pd
from kfp.v2.dsl import Dataset, Input

from build.model_manager_client.model.column import Column
from build.model_manager_client.model.databag import Databag
from load.dataframe import load_dataframe, save_dataframe
from model_manager.databags import (
    get_databag_by_id,
    update_databag,
    update_databag_status,
    upload_dataframe,
)
from models.status_message import StatusMessage
from sniffle.sniffle import get_num_rows, sniff_column_datatypes
from util.exception_handler import exception_handler


def sniffle_dataset(
    dataframe: Input[Dataset],
    max_categories: int,
    databag_id: str,
) -> None:
    """
    Guesses the datatypes of the columns in the dataframe.
    For local_file databags the type is derived from the values in the dataframe.
    For zip_file databags the type is derived from the suffix of the file names in the dataframe.
    """
    handler = functools.partial(
        update_databag_status,
        databag_id,
    )
    with exception_handler(handler, StatusMessage.DATASET_COULD_NOT_BE_READ):
        update_databag_status(databag_id, StatusMessage.INSPECTING_DATATYPES)
        df = load_dataframe(dataframe.path)
        columns = create_columns(df, max_categories)

        databag = get_databag_by_id(databag_id)
        databag.number_rows = get_num_rows(columns)
        databag.number_columns = len(columns)
        databag.columns = columns
        databag.status = StatusMessage.DATABAG_DONE.value
        update_databag(databag)
        upload_dataframe_to_databag(df, databag)


def create_columns(df: pd.DataFrame, max_categories=10) -> List[Column]:
    return sniff_column_datatypes(df, max_categories=max_categories)


def upload_dataframe_to_databag(df: pd.DataFrame, databag: Databag) -> None:
    with tempfile.NamedTemporaryFile() as file:
        save_dataframe(df, file.name)
        with open(file.name, "rb") as upload_file:
            upload_dataframe(upload_file, databag)
