import pytest

from models.status_message import StatusMessage
from util.exception_handler import (
    ExceptionHandlerException,
    HasErrorStatus,
    exception_handler,
)


def test_has_error_status_protocol():
    class ErrorStatus:
        error_status = "test_error_status"

    assert isinstance(ErrorStatus(), HasErrorStatus)


def test_exception_handler_called(mocker):
    handler = mocker.Mock()
    with pytest.raises(ExceptionHandlerException):
        with exception_handler(handler, StatusMessage.TRAINING_FAILED):
            raise ValueError()

    handler.assert_called_once_with(StatusMessage.TRAINING_FAILED)


def test_only_inner_exception_handler_is_called(mocker):
    inner_handler = mocker.Mock()
    outer_handler = mocker.Mock()
    with pytest.raises(ExceptionHandlerException):
        with exception_handler(outer_handler, StatusMessage.DATASET_NOT_FOUND):
            with exception_handler(
                inner_handler, StatusMessage.TRAINING_FAILED
            ):
                raise ValueError()

    inner_handler.assert_called_once_with(StatusMessage.TRAINING_FAILED)
    outer_handler.assert_not_called()


def test_only_inner_exception_handler_is_called2(mocker):
    inner_handler = mocker.Mock()
    outer_handler = mocker.Mock()
    with pytest.raises(ExceptionHandlerException):
        with exception_handler(
            outer_handler, StatusMessage.DATASET_NOT_FOUND
        ), exception_handler(inner_handler, StatusMessage.TRAINING_FAILED):
            raise ValueError()

    inner_handler.assert_called_once_with(StatusMessage.TRAINING_FAILED)
    outer_handler.assert_not_called()


def test_msg_from_exception_is_used(mocker):
    class TestException(Exception):
        error_status = StatusMessage.TRAINING_FAILED

    handler = mocker.Mock()
    with pytest.raises(ExceptionHandlerException):
        with exception_handler(handler, StatusMessage.DATASET_NOT_FOUND):
            raise TestException()

    handler.assert_called_once_with(StatusMessage.TRAINING_FAILED)
