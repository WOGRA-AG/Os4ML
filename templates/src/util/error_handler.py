from functools import wraps


def error_handler(handler_func):
    """
    Decorator that executes the handler_func when an error occurs while executing the decorated func.
    The Error is thrown again after the execution of the handler_func.
    """

    def _error_handler(func):
        @wraps(func)
        def func_with_error_status_update(*args, **kwargs):
            try:
                return func(*args, **kwargs)
            except Exception as e:
                if "solution_name" in kwargs:
                    handler_func(kwargs["solution_name"])
                raise e

        return func_with_error_status_update

    return _error_handler
