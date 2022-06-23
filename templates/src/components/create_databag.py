from kfp.v2.dsl import Dataset, Input
from src.jobmanager.solution import error_status_update
from src.load.databag import load_databag
from src.objectstore.objectstore import put_databag
from src.util.error_handler import error_handler


@error_handler(handler_func=error_status_update)
def create_databag(file: Input[Dataset], bucket: str, solution_name: str = ""):
    """Loads the databag.json file from kubeflow and uploads it to the object store."""
    databag = load_databag(file.path)
    put_databag(databag, bucket)
