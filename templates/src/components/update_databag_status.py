from kfp.v2.dsl import Artifact
from src.objectstore.objectstore import update_databag_status
from src.util.error_handler import error_handler


@error_handler
def update_status(
    status: str = "", *, depends_on: Artifact = None, bucket: str = None
) -> None:
    """Update the status of the solution with the new status."""
    update_databag_status(bucket, status)
