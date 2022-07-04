from src.jobmanager.solution import status_update
from src.util.error_handler import error_handler


@error_handler
def update_status(
    status: str = "", *, os4ml_namespace: str = "", solution_name: str = ""
) -> None:
    """Update the status of the solution with the new status."""
    status_update(solution_name, status, os4ml_namespace)
