import contextlib
from typing import Any, Callable

from exceptions.interface import HasErrorStatus
from models.status_message import StatusMessage

ErrorStatusHandler = Callable[[StatusMessage], Any]


class ExceptionHandlerException(Exception):
    def __init__(self):
        super().__init__(
            "This exception is just raised to prevent the other error_handler funcs from executing. "
            "See the Traceback above for details about the exception that was risen."
        )


@contextlib.contextmanager
def exception_handler(
    error_handler: ErrorStatusHandler, default_error_status: StatusMessage
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
        error_status = (
            e.error_status
            if isinstance(e, HasErrorStatus)
            else default_error_status
        )
        error_handler(error_status)
        raise ExceptionHandlerException()
