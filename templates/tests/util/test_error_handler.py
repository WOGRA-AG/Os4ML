import pytest

from src.util.error_handler import error_handler


def test_error_handler_with_error(mocker):
    handler_mock = mocker.Mock()

    def func_with_error(solution_name):
        raise ValueError("This is a test error")

    with pytest.raises(ValueError):
        error_handler(handler_func=handler_mock)(func_with_error)(
            solution_name="Test solution"
        )

    handler_mock.assert_called()


def test_error_handler_without_error(mocker):
    handler_mock = mocker.Mock()

    def noop(solution_name):
        pass

    error_handler(handler_func=handler_mock)(noop)(
        solution_name="Test solution"
    )

    handler_mock.assert_not_called()


def test_error_handler_with_return_value():
    def forty_two(solution_name):
        return 42

    value = error_handler(None)(forty_two)(solution_name="Test solution")
    assert value == 42
