import pytest

from model.error_msg_key import ErrorMsgKey
from util.exception_handler import (
    ErrorWithMsgKey,
    ExceptionHandlerException,
    exception_handler,
)


def test_error_with_msg_key_protocol():
    class WithMsgKey:
        error_msg_key = "test_error_key"

    assert isinstance(WithMsgKey(), ErrorWithMsgKey)


def test_exception_handler_called(mocker):
    handler = mocker.Mock()
    with pytest.raises(ExceptionHandlerException):
        with exception_handler(handler, ErrorMsgKey.TRAINING_FAILED):
            raise ValueError()

    handler.assert_called_once_with(ErrorMsgKey.TRAINING_FAILED)


def test_only_inner_exception_handler_is_called(mocker):
    inner_handler = mocker.Mock()
    outer_handler = mocker.Mock()
    with pytest.raises(ExceptionHandlerException):
        with exception_handler(outer_handler, ErrorMsgKey.DATASET_NOT_FOUND):
            with exception_handler(inner_handler, ErrorMsgKey.TRAINING_FAILED):
                raise ValueError()

    inner_handler.assert_called_once_with(ErrorMsgKey.TRAINING_FAILED)
    outer_handler.assert_not_called()


def test_only_inner_exception_handler_is_called2(mocker):
    inner_handler = mocker.Mock()
    outer_handler = mocker.Mock()
    with pytest.raises(ExceptionHandlerException):
        with exception_handler(
            outer_handler, ErrorMsgKey.DATASET_NOT_FOUND
        ), exception_handler(inner_handler, ErrorMsgKey.TRAINING_FAILED):
            raise ValueError()

    inner_handler.assert_called_once_with(ErrorMsgKey.TRAINING_FAILED)
    outer_handler.assert_not_called()


def test_msg_from_exception_is_used(mocker):
    class TestException(Exception):
        error_msg_key = ErrorMsgKey.TRAINING_FAILED

    handler = mocker.Mock()
    with pytest.raises(ExceptionHandlerException):
        with exception_handler(handler, ErrorMsgKey.DATASET_NOT_FOUND):
            raise TestException()

    handler.assert_called_once_with(ErrorMsgKey.TRAINING_FAILED)
