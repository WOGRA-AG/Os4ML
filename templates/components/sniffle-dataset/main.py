from kfp.v2.dsl import component, Dataset, Input


def sniff_datatypes(csv_file: Input[Dataset],
                    max_categories: int = 10,
                    dataset_type: str = 'local_file',
                    file_name: str = '',
                    bucket_name: str = '') -> Dataset:
    import pandas as pd
    import json
    from enum import Enum
    from dataclasses import dataclass

    class ColumnDataType(str, Enum):
        NUMERICAL = 'numerical'
        DATE = 'date'
        CATEGORY = 'category'
        TEXT = 'text'

    class ColumnUsage(str, Enum):
        LABEL = 'label'
        FEATURE = 'feature'

    @dataclass
    class Column:
        name: str
        type: str
        usage: str
        num_entries: int

    def sniff_column_datatypes(df: pd.DataFrame) -> list[Column]:
        columns_and_types = (
            (name, *sniff_series(column))
            for name, column in df.iteritems()
        )
        *columns, last_column = columns_and_types
        feature_columns = (
            Column(column, type_, ColumnUsage.FEATURE, num_entries)
            for column, type_, num_entries in columns
        )
        label_column = Column(last_column[0], last_column[1],
                              ColumnUsage.LABEL, last_column[2])
        return [*feature_columns, label_column]

    def sniff_series(series: pd.Series) -> tuple[ColumnDataType, int]:
        column_type = ColumnDataType.TEXT
        datatype = str(series.dtype)
        if 'int' in datatype or 'float' in datatype:
            column_type = ColumnDataType.NUMERICAL
        if 'date' in datatype:
            column_type = ColumnDataType.DATE
        if series.nunique() <= max_categories:
            column_type = ColumnDataType.CATEGORY
        return column_type, series.size

    def get_num_rows(columns: list[Column]) -> int:
        if not columns:
            return 0
        first, *rest = columns
        rows = first.num_entries
        assert (column.num_entries == rows for column in columns)
        return rows

    with open(csv_file.path, 'r') as input_file:
        df = pd.read_csv(input_file)

    column_info = sniff_column_datatypes(df)
    num_rows = get_num_rows(column_info)
    num_cols = len(column_info)
    column_info_dicts = [column.__dict__ for column in column_info]
    return json.dumps({
        'datasetType': dataset_type,
        'fileName': file_name,
        'databagName': file_name,
        'bucketName': bucket_name,
        'numberRows': num_rows,
        'numberColumns': num_cols,
        'columns': column_info_dicts
    })


if __name__ == '__main__':
    component(sniff_datatypes, base_image='amancevice/pandas:1.4.1-slim',
              output_component_file='component.yaml')
