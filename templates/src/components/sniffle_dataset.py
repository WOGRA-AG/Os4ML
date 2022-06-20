import json
from typing import List

import pandas as pd
from kfp.v2.dsl import Dataset, Input
from src.jobmanager.solution import error_status_update
from src.kfp.dataset import load_dataset
from src.model.column import Column
from src.sniffle.sniffle import (
    get_num_rows,
    sniff_column_datatypes,
    sniff_zip_types,
)
from src.util.error_handler import error_handler
from src.util.uri import extract_filename_from_uri, is_uri


@error_handler(handler_func=error_status_update)
def sniffle_dataset(
    dataset: Input[Dataset],
    dataset_type: str = "local_file",
    max_categories: int = 10,
    file_name: str = "",
    bucket_name: str = "",
    solution_name: str = "",
) -> Dataset:
    """
    Guesses the datatypes of the columns in the dataframe.
    For local_file databags the type is derived from the values in the dataframe.
    For zip_file databags the type is derived from the suffix of the file names in the dataframe.
    """

    df = load_dataset(dataset.path)
    column_list = create_column_list(df, dataset_type, max_categories)
    databag_name = (
        extract_filename_from_uri(file_name)
        if is_uri(file_name)
        else file_name
    )
    num_rows = get_num_rows(column_list)
    num_cols = len(column_list)
    column_info_dicts = [column.__dict__ for column in column_list]
    return json.dumps(
        {
            "dataset_type": dataset_type,
            "file_name": file_name,
            "databag_name": databag_name,
            "bucket_name": bucket_name,
            "number_rows": num_rows,
            "number_columns": num_cols,
            "columns": column_info_dicts,
        }
    )


def create_column_list(
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
