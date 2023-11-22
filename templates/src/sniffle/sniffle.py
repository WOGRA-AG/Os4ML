from __future__ import annotations

import os
from zipfile import ZipFile

import pandas as pd

from build.model_manager_client.model.column import Column
from exceptions.databag import MissingFileInZipFile
from models.column_data_type import ColumnDataType


def create_columns_of_databag(
    df: pd.DataFrame, max_categories=10, zip_file: ZipFile | None = None
) -> list[Column]:
    names_types_sizes = (
        (
            str(name),
            sniff_series(
                column, max_categories=max_categories, zip_file=zip_file
            ).value,
            column.size,
        )
        for name, column in df.items()
    )
    return [  # type: ignore
        Column(name=name, type=type_, num_entries=size)
        for name, type_, size in names_types_sizes
    ]


def sniff_series(
    series: pd.Series, max_categories=10, zip_file: ZipFile | None = None
) -> ColumnDataType:
    datatype = str(series.dtype)
    if series.nunique() <= max_categories:
        return ColumnDataType.CATEGORY
    if "int" in datatype or "float" in datatype:
        return ColumnDataType.NUMERICAL
    if "date" in datatype:
        return ColumnDataType.DATE
    return text_or_file_type(series, zip_file)


def text_or_file_type(
    series: pd.Series, zip_file: ZipFile | None
) -> ColumnDataType:
    if not zip_file:
        return ColumnDataType.TEXT
    namelist = zip_file.namelist()
    if series[0] not in namelist:
        return ColumnDataType.TEXT
    for s in series:
        if s not in namelist:
            raise MissingFileInZipFile(s)
    return ColumnDataType.IMAGE


def get_num_rows(columns: list[Column]) -> int:
    if not columns:
        return 0
    first, *_ = columns
    rows = first.num_entries
    assert (column.num_entries == rows for column in columns)
    return rows
