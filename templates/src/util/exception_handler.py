import contextlib
from typing import Callable, Protocol, runtime_checkable

from models.error_msg_key import ErrorMsgKey

ErrorMsgKeyHandler = Callable[[ErrorMsgKey], None]


class ExceptionHandlerException(Exception):
    def __init__(self):
        super().__init__(
            "This exception is just raised to prevent the other error_handler funcs from executing. "
            "See the Traceback above for details about the exception that was risen."
        )


@runtime_checkable
class ErrorWithMsgKey(Protocol):
    error_msg_key: ErrorMsgKey


@contextlib.contextmanager
def exception_handler(
    error_handler: ErrorMsgKeyHandler, default_error_msg_key: ErrorMsgKey
):
    """
    Contextmanager that calls the error_handler if an error is risen during the execution.
    error_handler should be a function that takes an error_msg_key as input.
    If the exception has an error_msg_key attribute it is passed to the error_handler.
    Otherwise, the default_err_msg_key is used.
    """
    try:
        yield None
    except ExceptionHandlerException:
        raise
    except Exception as e:
        error_msg_key = (
            e.error_msg_key
            if isinstance(e, ErrorWithMsgKey)
            else default_error_msg_key
        )
        error_handler(error_msg_key)
        raise ExceptionHandlerException()
