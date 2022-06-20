import pytest
from src.util.error_handler import error_handler


def test_error_handler_with_error(mocker):
    handler_mock = mocker.Mock()

    def func_with_error():
        raise ValueError("This is a test error")

    with pytest.raises(ValueError):
        error_handler(handler_func=handler_mock)(func_with_error)()

    handler_mock.assert_called()


def test_error_handler_without_error(mocker):
    handler_mock = mocker.Mock()

    def noop():
        pass

    error_handler(handler_func=handler_mock)(noop)()

    handler_mock.assert_not_called()


def test_error_handler_with_return_value():
    def forty_two():
        return 42

    value = error_handler(None)(forty_two)()
    assert value == 42
