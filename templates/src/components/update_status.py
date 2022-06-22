from kfp.v2.dsl import Artifact
from src.jobmanager.solution import status_update
from src.util.error_handler import error_handler


@error_handler
def update_status(status: str = "", *, solution_name: str = "") -> None:
    """Update the status of the solution with the new status."""
    status_update(solution_name, status)
