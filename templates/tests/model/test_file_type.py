import pytest

from src.model.file_type import FileType


@pytest.mark.parametrize(
    "name,expected_file_type",
    [
        ("data.csv", FileType.CSV),
        ("data.zip", FileType.ZIP),
        ("excel.xlsx", FileType.EXCEL),
        ("long-excel-file-name.xls", FileType.EXCEL),
        ("open-document-spreadsheet.ods", FileType.EXCEL),
    ],
)
def test_from_file_name(name, expected_file_type):
    assert FileType.from_file_name(name) == expected_file_type
