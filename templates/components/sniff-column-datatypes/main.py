import json
from enum import Enum

import pandas as pd
from kfp.v2.dsl import component, Dataset, Input, Output

MAX_NUM_CATEGORIES = 10


class ColumnDataType(str, Enum):
    NUMERICAL = 'numerical'
    DATE = 'date'
    CATEGORY = 'category'
    TEXT = 'text'


class ColumnUsage(str, Enum):
    LABEL = 'label'
    FEATURE = 'feature'


@component(base_image='python:3.9.10-slim',
           output_component_file='component.yaml',
           packages_to_install=['pandas>=1.4.0'])
def sniff_column_datatypes(csv_file: Input[Dataset],
                           json_file: Output[Dataset]):
    import pandas as pd

    with open(csv_file.path, 'r') as file:
        df = pd.read_csv(file)

    column_info_json = sniff_column_datatypes_to_json(df)

    with open(json_file, 'w') as file:
        file.write(column_info_json)


def sniff_column_datatypes_to_json(df: pd.DataFrame):
    colum_info = sniff_column_datatypes_from_df(df)
    return json.dumps(colum_info)


def sniff_column_datatypes_from_df(df: pd.DataFrame):
    columns_and_types = (
        (name, sniff_series(column))
        for name, column in df.iteritems()
    )
    *first_columns, last_column = columns_and_types
    feature_columns = (
        create_list_entry(column, type_, ColumnUsage.FEATURE)
        for column, type_ in first_columns
    )
    label_column = create_list_entry(*last_column, ColumnUsage.LABEL)
    return [*feature_columns, label_column]


def create_list_entry(name, type_, usage):
    return {
        'name': name,
        'type': type_,
        'usage': usage,
    }


def sniff_series(series: pd.Series) -> ColumnDataType:
    column_type = ColumnDataType.TEXT
    datatype = str(series.dtype)
    if 'int' in datatype or 'float' in datatype:
        column_type = ColumnDataType.NUMERICAL
    if 'date' in datatype:
        column_type = ColumnDataType.DATE
    if series.nunique() <= MAX_NUM_CATEGORIES:
        column_type = ColumnDataType.CATEGORY
    return column_type
