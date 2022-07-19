from kfp.v2.dsl import Artifact
from src.objectstore.objectstore import (
    update_databag_status as _update_databag_status,
)
from src.util.error_handler import error_handler


@error_handler
def update_databag_status(
    status: str = "",
    *,
    depends_on: Artifact = None,
    os4ml_namespace: str = "",
    bucket: str = None,
    run_id: str = "",
) -> None:
    """Update the status of the solution with the new status."""
    _update_databag_status(bucket, status, os4ml_namespace, run_id=run_id)
