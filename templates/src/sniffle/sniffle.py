from typing import List

import numpy as np
import pandas as pd

from build.model_manager_client.model.column import Column
from models.column_data_type import ColumnDataType


def sniff_column_datatypes(
    df: pd.DataFrame, max_categories=10
) -> List[Column]:
    names_types_sizes = (
        (
            str(name),
            sniff_series(column, max_categories=max_categories).value,
            column.size,
        )
        for name, column in df.items()
    )
    return [
        Column(name=name, type=type_, num_entries=size)
        for name, type_, size in names_types_sizes
    ]


def sniff_series(series: pd.Series, max_categories=10) -> ColumnDataType:
    datatype = str(series.dtype)
    if datatype == "object" and isinstance(series[0], np.ndarray):
        return ColumnDataType.IMAGE
    if series.nunique() <= max_categories:
        return ColumnDataType.CATEGORY
    if "int" in datatype or "float" in datatype:
        return ColumnDataType.NUMERICAL
    if "date" in datatype:
        return ColumnDataType.DATE
    if datatype == "object" and isinstance(series[0], str):
        return ColumnDataType.TEXT
    return ColumnDataType.TEXT


def get_num_rows(columns: List[Column]) -> int:
    if not columns:
        return 0
    first, *rest = columns
    rows = first.num_entries
    assert (column.num_entries == rows for column in columns)
    return rows
