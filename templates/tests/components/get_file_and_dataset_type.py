import pytest
from model.databag_type import DatasetType
from model.file_type import FileType

from components.get_file_and_dataset_type import (
    dataset_type_from_file_name,
    file_type_from_file_name,
)


@pytest.mark.parametrize(
    ("file_name", "file_type"),
    (
        ("data.csv", FileType.CSV),
        ("data.zip", FileType.ZIP),
        ("excel.xlsx", FileType.EXCEL),
        ("long-excel-file-name.xlsx", FileType.EXCEL),
        ("open-document-spreadsheet.ods", FileType.EXCEL),
        (
            "https://gist.githubusercontent.com/f/2/raw/3/titanic_dataset.csv",
            FileType.CSV,
        ),
        ("https://fake.url.excel.file.com/birthdays.xlsx", FileType.EXCEL),
    ),
)
def test_file_type_from_file_name(file_name: str, file_type: FileType):
    assert file_type_from_file_name(file_name) == file_type


@pytest.mark.parametrize(
    ("file_name", "dataset_type"),
    (
        ("https://www.wogra.com/csvs/data.csv", DatasetType.file_url),
        ("https://www.wogra.com/data.zip", DatasetType.file_url),
        ("data.csv", DatasetType.local_file),
    ),
)
def test_from_uri(file_name: str, dataset_type: DatasetType):
    assert dataset_type_from_file_name(file_name) == dataset_type
