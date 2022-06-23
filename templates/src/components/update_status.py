from kfp.v2.dsl import Artifact
from src.jobmanager.solution import error_status_update, status_update
from src.util.error_handler import error_handler


@error_handler(handler_func=error_status_update)
def update_status(
    status: str = "", depends_on: Artifact = None, solution_name: str = ""
):
    """Update the status of the solution with the new status."""
    status_update(solution_name, status)
