import zipfile

import pytest
from pytest_mock import MockerFixture

from main import create_dataframe

import pandas as pd
import io
import requests

local_file_type = 'local_file'
zip_file_type = 'zip_file'


@pytest.fixture
def mock_df():
    return pd.DataFrame({'city': ['augsburg', 'berlin'], 'inhabitants': [300_000, 3_500_000]})


def test_create_dataframe_with_csv(mocker: MockerFixture, mock_df):
    mocker.patch.object(pd, 'read_csv', return_value=mock_df)

    db_type, df = create_dataframe('', 'mock.csv')

    assert db_type == local_file_type
    with io.StringIO(df) as csv:
        restored_df = pd.read_csv(csv)
    assert restored_df.equals(mock_df)


def test_create_dataframe_with_excel(mocker: MockerFixture, mock_df):
    mocker.patch.object(pd, 'read_excel', return_value=mock_df)

    db_type, df = create_dataframe('', 'mock.xlsx')

    assert db_type == local_file_type
    with io.StringIO(df) as csv:
        restored_df = pd.read_csv(csv)
    assert restored_df.equals(mock_df)


def test_create_dataframe_with_zip(mocker: MockerFixture):
    mock_get = mocker.MagicMock()

    with zipfile.ZipFile('test.zip') as mock_zip:
        mock_path = zipfile.Path(mock_zip)
        mocker.patch.object(requests, 'get', return_value=mock_get)
        mocker.patch.object(zipfile, 'ZipFile', return_value=mock_zip)
        mocker.patch.object(zipfile, 'Path', return_value=mock_path)
        zipfile_name = 'mock.zip'
        bucket = 'bucket'

        db_type, df = create_dataframe(bucket, zipfile_name)

    assert db_type == zip_file_type
    expected_df = pd.DataFrame({
        'file': ['test/tree/1.png', 'test/tree/0.png', 'test/building/3.png', 'test/building/2.png'],
        'label': ['tree', 'tree', 'building', 'building']})
    with io.StringIO(df) as csv:
        restored_df = pd.read_csv(csv)
    assert restored_df.equals(expected_df)
