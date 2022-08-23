import json
from typing import List

import pandas as pd
from kfp.v2.dsl import Dataset, Input

from build.objectstore.model.column import Column
from build.objectstore.model.databag import Databag
from kfp_util.dataset import load_dataset
from sniffle.sniffle import (
    get_num_rows,
    sniff_column_datatypes,
    sniff_zip_types,
)
from util.error_handler import error_handler
from util.uri import extract_filename_from_uri, is_uri


@error_handler
def sniffle_dataset(
    dataset: Input[Dataset],
    dataset_type: str = "local_file",
    max_categories: int = 10,
    file_name: str = "",
    *,
    os4ml_namespace: str = "",
    bucket: str = None,
    databag_id: str = "",
    run_id: str = "",
) -> str:
    """
    Guesses the datatypes of the columns in the dataframe.
    For local_file databags the type is derived from the values in the dataframe.
    For zip_file databags the type is derived from the suffix of the file names in the dataframe.
    """

    df = load_dataset(dataset.path)
    columns = create_columns(df, dataset_type, max_categories)
    databag_name = (
        extract_filename_from_uri(file_name)
        if is_uri(file_name)
        else file_name
    )
    num_rows = get_num_rows(columns)
    num_cols = len(columns)
    databag = Databag(
        dataset_type=dataset_type,
        file_name=file_name,
        databag_name=databag_name,
        bucket_name=bucket,
        databag_id=databag_id,
        number_rows=num_rows,
        number_columns=num_cols,
        columns=columns,
        run_id=run_id,
    )
    return json.dumps(databag.to_dict())


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
