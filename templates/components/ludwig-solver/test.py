import os
from contextlib import contextmanager
from tempfile import NamedTemporaryFile
from textwrap import dedent

import ludwig.api
from main import ludwig_solver
from pytest_mock import MockerFixture


@contextmanager
def make_tmp_file(contents=None):
    with NamedTemporaryFile(mode="wt", encoding="utf-8", delete=False) as file:
        if contents:
            file.write(contents)
    try:
        yield file.name
    finally:
        os.remove(file.name)


def test_ludwig_solver(mocker: MockerFixture):
    csv = dedent(
        """
    city,age,bool
    Augsburg,12,1
    Berlin,33,0
    Munich,44,1
    Stuttgart,22,1
    Mainz,77,0
    """
    )
    settings = (
        '{"dataset_type": "local_file", "number_rows": 5, '
        '"number_columns": 3, "columns": [{"name": "city", "type": '
        '"text", "usage": "feature", "num_entries": 5}, {"name": '
        '"age", "type": "numerical", "usage": "feature", '
        '"num_entries": 5}, {"name": "bool", "type": "category", '
        '"usage": "label", "num_entries": 5}]}'
    )
    with make_tmp_file(csv) as csv_file, make_tmp_file(
        settings
    ) as settings_file:
        csv_mock = mocker.MagicMock()
        csv_mock.path = csv_file
        settings_mock = mocker.MagicMock()
        settings_mock.path = settings_file
        cls_metrics = mocker.MagicMock()
        metrics = mocker.MagicMock()
        ludwig_spy = mocker.spy(ludwig.api.LudwigModel, "__init__")

        ludwig_solver(csv_mock, settings_mock, cls_metrics, metrics, 8, 2)

        expected_definition = {
            "input_features": [
                {
                    "name": "city",
                    "type": "text",
                },
                {
                    "name": "age",
                    "type": "numerical",
                    "preprocessing": {"fill_value": 0},
                },
            ],
            "output_features": [
                {
                    "name": "bool",
                    "type": "category",
                }
            ],
            "training": {
                "batch_size": 8,
                "epochs": 2,
                "early_stop": 10,
            },
        }

        actual_definition = ludwig_spy.call_args[0][1]
        assert actual_definition == expected_definition
        metrics.log_metric.assert_called_once()
        cls_metrics.log_confusion_matrix.assert_called_once()
