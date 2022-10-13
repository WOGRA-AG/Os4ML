import pathlib
from typing import List

import pandas as pd

from build.objectstore.model.column import Column
from model.column_data_type import ColumnDataType


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
    return [
        Column(name=name, type=type_, num_entries=size)
        for name, type_, size in names_types_sizes
    ]


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
            name="file",
            type=ColumnDataType.IMAGE,
            num_entires=num_files,
        )
    else:
        raise NotImplementedError()
    num_labels = len(df["label"])
    label_column = Column(
        name="label",
        type=ColumnDataType.CATEGORY,
        num_entries=num_labels,
    )
    return [file_column, label_column]


def get_num_rows(columns: List[Column]) -> int:
    if not columns:
        return 0
    first, *rest = columns
    rows = first.num_entries
    assert (column.num_entries == rows for column in columns)
    return rows
