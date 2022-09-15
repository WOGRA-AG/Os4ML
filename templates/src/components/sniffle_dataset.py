import functools
from typing import List

import pandas as pd
from kfp.v2.dsl import Dataset, Input

from build.objectstore.model.column import Column
from kfp_util.dataset import load_dataset
from model.error_msg_key import ErrorMsgKey
from objectstore.objectstore import (
    download_databag_by_id,
    error_databag_status_update,
    put_databag,
    update_databag_status,
)
from pipelines.util import DatabagStatusMessages
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
    os4ml_namespace: str,
) -> None:
    """
    Guesses the datatypes of the columns in the dataframe.
    For local_file databags the type is derived from the values in the dataframe.
    For zip_file databags the type is derived from the suffix of the file names in the dataframe.
    """
    handler = functools.partial(
        error_databag_status_update,
        databag_id,
        os4ml_namespace=os4ml_namespace,
    )
    with exception_handler(handler, ErrorMsgKey.DATASET_COULD_NOT_BE_READ):
        update_databag_status(
            databag_id, DatabagStatusMessages.inspecting, os4ml_namespace
        )
        df = load_dataset(dataset.path)
        columns = create_columns(df, dataset_type, max_categories)

        databag = download_databag_by_id(databag_id, os4ml_namespace)
        databag.dataset_type = dataset_type
        databag.number_rows = get_num_rows(columns)
        databag.number_columns = len(columns)
        databag.columns = columns
        databag.status = DatabagStatusMessages.creating.value
        put_databag(databag, os4ml_namespace)


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
