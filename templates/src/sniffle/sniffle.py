import pathlib
from typing import List

import pandas as pd

from src.model.column import Column
from src.model.column_data_type import ColumnDataType
from src.model.column_usage import ColumnUsage


def sniff_column_datatypes(
    df: pd.DataFrame, max_categories=10
) -> List[Column]:
    names_types_sizes = (
        (
            str(name),
            sniff_series(column, max_categories=max_categories),
            column.size,
        )
        for name, column in df.iteritems()
    )
    columns = (
        Column(name, type_, ColumnUsage.FEATURE, size)
        for name, type_, size in names_types_sizes
    )
    *feature_columns, label_column = columns
    label_column.usage = ColumnUsage.LABEL
    return [*feature_columns, label_column]


def sniff_series(series: pd.Series, max_categories=10) -> ColumnDataType:
    column_type = ColumnDataType.TEXT
    datatype = str(series.dtype)
    if "int" in datatype or "float" in datatype:
        column_type = ColumnDataType.NUMERICAL
    if "date" in datatype:
        column_type = ColumnDataType.DATE
    if series.nunique() <= max_categories:
        column_type = ColumnDataType.CATEGORY
    return column_type


def sniff_zip_types(df: pd.DataFrame) -> List[Column]:
    example_file = df["file"][0]
    num_files = len(df["file"])
    suffix = pathlib.Path(example_file).suffix.lower()
    if suffix in (".jpg", ".jpeg", ".png", ".tiff"):
        file_column = Column(
            "file", ColumnDataType.IMAGE, ColumnUsage.FEATURE, num_files
        )
    else:
        raise NotImplementedError()
    num_labels = len(df["label"])
    label_column = Column(
        "label", ColumnDataType.CATEGORY, ColumnUsage.LABEL, num_labels
    )
    return [file_column, label_column]


def get_num_rows(columns: List[Column]) -> int:
    if not columns:
        return 0
    first, *rest = columns
    rows = first.num_entries
    assert (column.num_entries == rows for column in columns)
    return rows
