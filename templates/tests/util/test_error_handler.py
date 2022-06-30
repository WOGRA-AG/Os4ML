import pytest

import src.util.error_handler
from src.util.error_handler import error_handler


@pytest.fixture
def func_with_error():
    @error_handler
    def _func_with_error(**kwargs):
        raise ValueError("This is a test error")

    return _func_with_error


@pytest.fixture
def func_without_error():
    @error_handler
    def _func_without_error(**kwargs):
        pass

    return _func_without_error


def test_error_handler_with_error_with_solution_name(mocker, func_with_error):
    status_update_mock = mocker.Mock()
    mocker.patch.object(
        src.util.error_handler, "error_status_update", status_update_mock
    )

    with pytest.raises(ValueError):
        func_with_error(solution_name="test", os4ml_namespace="os4ml")

    status_update_mock.assert_called_once()


def test_error_handler_with_error_without_solution_name_or_bucket(
    mocker, func_with_error
):
    status_update_spy = mocker.spy(
        src.util.error_handler, "error_status_update"
    )
    databag_status_spy = mocker.spy(
        src.util.error_handler, "error_databag_status_update"
    )

    with pytest.raises(ValueError):
        func_with_error()

    status_update_spy.assert_not_called()
    databag_status_spy.assert_not_called()


def test_error_handler_with_error_with_bucket(mocker, func_with_error):
    databag_status_mock = mocker.Mock()
    mocker.patch.object(
        src.util.error_handler,
        "error_databag_status_update",
        databag_status_mock,
    )

    with pytest.raises(ValueError):
        func_with_error(bucket="test", os4ml_namespace="os4ml")

    databag_status_mock.assert_called_once()


@pytest.mark.parametrize(
    "kwargs",
    [
        {},
        {"solution_name": "test"},
        {"bucket": "test"},
        {"solution_name": "test", "bucket": "test"},
    ],
)
def test_error_handler_without_error(mocker, func_without_error, kwargs):
    status_update_spy = mocker.spy(
        src.util.error_handler, "error_status_update"
    )
    databag_status_spy = mocker.spy(
        src.util.error_handler, "error_databag_status_update"
    )

    func_without_error(**kwargs)

    status_update_spy.assert_not_called()
    databag_status_spy.assert_not_called()


def test_error_handler_with_return_value():
    @error_handler
    def forty_two():
        return 42

    assert forty_two() == 42
