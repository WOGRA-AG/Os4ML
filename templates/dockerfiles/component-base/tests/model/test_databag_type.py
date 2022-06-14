import pytest
from src.model.databag_type import DatabagType


@pytest.mark.parametrize(
    "uri,expected_type",
    [
        (
            "https://www.wogra.com/shepard/api/data.csv",
            DatabagType.shepard_url,
        ),
        ("https://www.wogra.com/not-shepard/data.csv", DatabagType.file_url),
        ("https://www.wogra.com/data.zip", DatabagType.file_url),
        ("data.zip", DatabagType.zip_file),
        ("data.csv", DatabagType.local_file),
    ],
)
def test_from_uri(uri, expected_type):
    assert DatabagType.from_uri(uri) == expected_type
