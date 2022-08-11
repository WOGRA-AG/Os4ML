from functools import wraps

from jobmanager.solution import error_status_update
from objectstore.objectstore import error_databag_status_update


def error_handler(func):
    """
    Decorator that updates the status of the solution or databag if an error occurs during the executing of func.
    """

    @wraps(func)
    def func_with_error_status_update(*args, **kwargs):
        try:
            return func(*args, **kwargs)
        except Exception as e:
            if not (os4ml_namespace := kwargs.get("os4ml_namespace", False)):
                print("Error occurred, but no os4ml_namespace was given")
            elif solution_name := kwargs.get("solution_name", False):
                error_status_update(solution_name, os4ml_namespace)
            elif bucket := kwargs.get("bucket", False):
                error_databag_status_update(bucket, os4ml_namespace)
            else:
                print(
                    "Error occurred, but neither a solution_name nor a bucket is given"
                )
            raise e

    return func_with_error_status_update
