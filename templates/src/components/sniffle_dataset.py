import functools
import tempfile
from typing import List

import pandas as pd
from kfp.v2.dsl import Dataset, Input

from build.model_manager_client.model.column import Column
from build.model_manager_client.model.databag import Databag
from load.dataframe import load_dataframe
from model_manager.databags import (
    get_databag_by_id,
    update_databag,
    update_databag_error_status,
    update_databag_status,
    upload_dataframe,
)
from sniffle.sniffle import (
    get_num_rows,
    sniff_column_datatypes,
    sniff_zip_types,
)
from util.exception_handler import exception_handler


def sniffle_dataset(
    dataset: Input[Dataset],
    dataset_type: str,
    max_categories: int,
    databag_id: str,
) -> None:
    """
    Guesses the datatypes of the columns in the dataframe.
    For local_file databags the type is derived from the values in the dataframe.
    For zip_file databags the type is derived from the suffix of the file names in the dataframe.
    """
    handler = functools.partial(
        update_databag_error_status,
        databag_id,
    )
    with exception_handler(handler, ErrorMsgKey.DATASET_COULD_NOT_BE_READ):
        update_databag_status(databag_id, DatabagStatusMessages.inspecting)
        df = load_dataframe(dataset.path)
        columns = create_columns(df, dataset_type, max_categories)

        databag = get_databag_by_id(databag_id)
        databag.dataset_type = dataset_type
        databag.number_rows = get_num_rows(columns)
        databag.number_columns = len(columns)
        databag.columns = columns
        databag.status = DatabagStatusMessages.creating.value
        update_databag(databag)
        upload_dataframe_to_databag(df, databag)


def create_columns(
    df: pd.DataFrame, dataset_type: str, max_categories=10
) -> List[Column]:
    if dataset_type == "local_file" or dataset_type == "file_url":
        return sniff_column_datatypes(df, max_categories=max_categories)
    elif dataset_type == "zip_file":
        return sniff_zip_types(df)
    elif dataset_type == "shepard_url":
        return []
    else:
        raise NotImplementedError()


def upload_dataframe_to_databag(df: pd.DataFrame, databag: Databag) -> None:
    with tempfile.NamedTemporaryFile() as file:
        with open(file.name, "wb") as output_file:
            df.to_csv(output_file, index=False)
        with open(file.name, "rb") as upload_file:
            upload_dataframe(upload_file, databag)
