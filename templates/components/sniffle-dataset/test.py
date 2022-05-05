import os
from contextlib import contextmanager
from datetime import datetime, timedelta
from tempfile import NamedTemporaryFile
from textwrap import dedent

import pandas as pd
import pytest
from main import sniff_datatypes


@pytest.mark.parametrize(
    "test_data, expected_json",
    [
        (
            {
                "city": ["Augsburg"],
            },
            '{"datasetType": "local_file", "fileName": "", "databagName": "", '
            '"bucketName": "", "numberRows": 1, "numberColumns": 1, '
            ""
            '"columns": [{"name": "city", "type": "category", "usage": "label", '
            '"num_entries": 1}]}',
        ),
        (
            {
                "city": ["Augsburg", "Berlin", "Munich"],
            },
            '{"datasetType": "local_file", "fileName": "", "databagName": "", '
            '"bucketName": "", "numberRows": 3, "numberColumns": 1, '
            '"columns": [{"name": "city", "type": "text", "usage": "label", '
            '"num_entries": 3}]}',
        ),
        (
            {
                "age": [22, 33.5, 55],
            },
            '{"datasetType": "local_file", "fileName": "", "databagName": "", '
            '"bucketName": "", "numberRows": 3, "numberColumns": 1, '
            '"columns": [{"name": "age", "type": "numerical", "usage": "label", '
            '"num_entries": 3}]}',
        ),
        (
            {
                "age": [22, 33.5],
            },
            '{"datasetType": "local_file", "fileName": "", "databagName": "", '
            '"bucketName": "", "numberRows": 2, "numberColumns": 1, '
            '"columns": [{"name": "age", "type": "category", "usage": "label", '
            '"num_entries": 2}]}',
        ),
        (
            {
                "student": [0, 1, 1, 0, 1, 0, 1, 0, 1, 0, 1],
            },
            '{"datasetType": "local_file", "fileName": "", "databagName": "", '
            '"bucketName": "", "numberRows": 11, "numberColumns": 1, '
            '"columns": [{"name": "student", "type": "category", "usage": "label", '
            '"num_entries": 11}]}',
        ),
        (
            {
                "char": ["a", "b", "a", "a", "b", "a", "b"],
            },
            '{"datasetType": "local_file", "fileName": "", "databagName": "", '
            '"bucketName": "", "numberRows": 7, "numberColumns": 1, '
            '"columns": [{"name": "char", "type": "category", "usage": "label", '
            '"num_entries": 7}]}',
        ),
        (
            {
                "dates": [
                    datetime.today(),
                    datetime.today() - timedelta(days=1),
                    datetime.today() - timedelta(days=2),
                ],
            },
            '{"datasetType": "local_file", "fileName": "", "databagName": "", '
            '"bucketName": "", "numberRows": 3, "numberColumns": 1, '
            '"columns": [{"name": "dates", "type": "date", "usage": "label", '
            '"num_entries": 3}]}',
        ),
        (
            {"city": ["Augsburg", "Berlin", "Munich"], "age": [200, 400, 600]},
            '{"datasetType": "local_file", "fileName": "", "databagName": "", '
            '"bucketName": "", "numberRows": 3, "numberColumns": 2, '
            '"columns": [{"name": "city", "type": "text", "usage": "feature", '
            '"num_entries": 3}, {"name": "age", "type": "numerical", "usage": '
            '"label", "num_entries": 3}]}',
        ),
    ],
)
def test_sniff_datatypes(test_data, expected_json, mocker):
    open_mock = mocker.patch("builtins.open")
    mocker.patch.object(pd, "read_csv", return_value=pd.DataFrame(test_data))

    column_info = sniff_datatypes(mocker.Mock(), max_categories=2)

    open_mock.assert_called_once()
    assert column_info == expected_json


@contextmanager
def make_tmp_file(contents=None):
    with NamedTemporaryFile(mode="wt", encoding="utf-8", delete=False) as file:
        if contents:
            file.write(contents)
    try:
        yield file.name
    finally:
        os.remove(file.name)


def test_sniff_datatypes_with_file(mocker):
    test_csv = dedent(
        """
    city,age,bool
    Augsburg,12,1
    Berlin,33,0
    Munich,44,1
    Stuttgart,22,1
    Mainz,77,0
    """
    )
    expected = (
        '{"datasetType": "local_file", "fileName": "", "databagName": "", '
        '"bucketName": "", "numberRows": 5, '
        '"numberColumns": 3, "columns": [{"name": "city", "type": '
        '"text", "usage": "feature", "num_entries": 5}, {"name": '
        '"age", "type": "numerical", "usage": "feature", '
        '"num_entries": 5}, {"name": "bool", "type": "category", '
        '"usage": "label", "num_entries": 5}]}'
    )

    with make_tmp_file(test_csv) as csv_file:
        path_mock = mocker.MagicMock()
        path_mock.path = csv_file
        assert sniff_datatypes(path_mock, max_categories=4) == expected


def test_sniff_datatypes_with_zip(mocker):
    mock_df = pd.DataFrame(
        {
            "file": [
                "test/tree/0.png",
                "test/tree/1.png",
                "test/building/2.png",
                "test/building/3.png",
            ],
            "label": ["tree", "tree", "label", "label"],
        }
    )
    open_mock = mocker.patch("builtins.open")
    mocker.patch.object(pd, "read_csv", return_value=mock_df)

    column_info = sniff_datatypes(
        mocker.Mock(), dataset_type="zip_file", max_categories=2
    )

    open_mock.assert_called_once()
    expected_json = (
        '{"datasetType": "zip_file", "fileName": "", "databagName": "", '
        '"bucketName": "", "numberRows": 4, '
        '"numberColumns": 2, "columns": [{"name": "file", "type": '
        '"image", "usage": "feature", "num_entries": 4}, {"name": '
        '"label", "type": "category", "usage": "label", '
        '"num_entries": 4}]}'
    )
    assert column_info == expected_json
