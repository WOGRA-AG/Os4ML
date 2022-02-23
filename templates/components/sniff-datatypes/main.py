from kfp.v2.dsl import component, Dataset, Input


def sniff_datatypes(csv_file: Input[Dataset],
                    max_categories: int = 10) -> Dataset:
    import pandas as pd
    import json
    from enum import Enum

    class ColumnDataType(str, Enum):
        NUMERICAL = 'numerical'
        DATE = 'date'
        CATEGORY = 'category'
        TEXT = 'text'

    class ColumnUsage(str, Enum):
        LABEL = 'label'
        FEATURE = 'feature'

    def sniff_column_datatypes(df: pd.DataFrame):
        columns_and_types = (
            (name, sniff_series(column))
            for name, column in df.iteritems()
        )
        *columns, last_column = columns_and_types
        feature_columns = (
            create_entry(column, type_, ColumnUsage.FEATURE)
            for column, type_ in columns
        )
        label_column = create_entry(*last_column, ColumnUsage.LABEL)
        return [*feature_columns, label_column]

    def create_entry(name, type_, usage):
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
        if series.nunique() <= max_categories:
            column_type = ColumnDataType.CATEGORY
        return column_type

    with open(csv_file.path, 'r') as input_file:
        df = pd.read_csv(input_file)

    column_info = sniff_column_datatypes(df)
    return json.dumps(column_info)


if __name__ == '__main__':
    component(sniff_datatypes, base_image='amancevice/pandas:1.4.1-slim',
              output_component_file='component.yaml')
