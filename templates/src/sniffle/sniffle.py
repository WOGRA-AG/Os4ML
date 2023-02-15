import pathlib
from typing import List

import pandas as pd

from build.model_manager_client.model.column import Column
from config import CATEGORY_COL_NAME, IMAGE_COL_NAME
from models.column_data_type import ColumnDataType


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
        column_type = ColumnDataType.NUMERICAL.value
    if "date" in datatype:
        column_type = ColumnDataType.DATE.value
    if series.nunique() <= max_categories:
        column_type = ColumnDataType.CATEGORY.value
    return column_type


def sniff_zip_types(df: pd.DataFrame) -> List[Column]:
    example_file = df[IMAGE_COL_NAME][0]
    num_files = len(df[IMAGE_COL_NAME])
    suffix = pathlib.Path(example_file).suffix.lower()
    if suffix in (".jpg", ".jpeg", ".png", ".tif", ".tiff"):
        file_column = Column(
            name=IMAGE_COL_NAME,
            type=ColumnDataType.IMAGE.value,
            num_entries=num_files,
        )
    else:
        raise NotImplementedError()
    num_labels = len(df[CATEGORY_COL_NAME])
    label_column = Column(
        name=CATEGORY_COL_NAME,
        type=ColumnDataType.CATEGORY.value,
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
