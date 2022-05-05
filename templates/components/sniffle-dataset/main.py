from kfp.v2.dsl import Dataset, Input, component


def sniff_datatypes(
    dataset: Input[Dataset],
    dataset_type: str = "local_file",
    max_categories: int = 10,
    file_name: str = "",
    bucket_name: str = "",
) -> Dataset:
    """
    Guesses the datatypes of the columns in the dataframe.
    For local_file databags the type is derived from the values in the dataframe.
    For zip_file databags the type is derived from the suffix of the file names in the dataframe.
    """
    import dataclasses
    import enum
    import json
    import pathlib

    import pandas as pd

    class ColumnDataType(str, enum.Enum):
        NUMERICAL = "numerical"
        DATE = "date"
        CATEGORY = "category"
        TEXT = "text"
        IMAGE = "image"

    class ColumnUsage(str, enum.Enum):
        LABEL = "label"
        FEATURE = "feature"

    @dataclasses.dataclass
    class Column:
        name: str
        type: str
        usage: str
        num_entries: int

    def sniff_column_datatypes(df: pd.DataFrame) -> list[Column]:
        columns_and_types = (
            (name, *sniff_series(column)) for name, column in df.iteritems()
        )
        *columns, last_column = columns_and_types
        feature_columns = (
            Column(column, type_, ColumnUsage.FEATURE, num_entries)
            for column, type_, num_entries in columns
        )
        label_column = Column(
            last_column[0], last_column[1], ColumnUsage.LABEL, last_column[2]
        )
        return [*feature_columns, label_column]

    def sniff_series(series: pd.Series) -> tuple[ColumnDataType, int]:
        column_type = ColumnDataType.TEXT
        datatype = str(series.dtype)
        if "int" in datatype or "float" in datatype:
            column_type = ColumnDataType.NUMERICAL
        if "date" in datatype:
            column_type = ColumnDataType.DATE
        if series.nunique() <= max_categories:
            column_type = ColumnDataType.CATEGORY
        return column_type, series.size

    def sniff_zip_types(df: pd.DataFrame) -> list[Column]:
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

    def get_num_rows(columns: list[Column]) -> int:
        if not columns:
            return 0
        first, *rest = columns
        rows = first.num_entries
        assert (column.num_entries == rows for column in columns)
        return rows

    with open(dataset.path, "r") as dataset_file:
        df = pd.read_csv(dataset_file)

    if dataset_type == "local_file":
        column_info = sniff_column_datatypes(df)
    elif dataset_type == "zip_file":
        column_info = sniff_zip_types(df)
    else:
        raise NotImplementedError()

    num_rows = get_num_rows(column_info)
    num_cols = len(column_info)
    column_info_dicts = [column.__dict__ for column in column_info]
    return json.dumps(
        {
            "dataset_type": dataset_type,
            "file_name": file_name,
            "databag_name": file_name,
            "bucket_name": bucket_name,
            "number_rows": num_rows,
            "number_columns": num_cols,
            "columns": column_info_dicts,
        }
    )


if __name__ == "__main__":
    component(
        sniff_datatypes,
        base_image="amancevice/pandas:1.4.1-slim",
        output_component_file="component.yaml",
    )
