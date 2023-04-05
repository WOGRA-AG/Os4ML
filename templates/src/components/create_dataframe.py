import functools
import tempfile

from kfp.v2.dsl import Dataset, Output

from load.dataframe import create_df, save_dataframe
from model_manager.databags import get_databag_by_id, update_databag_status
from models.status_message import StatusMessage
from util.download import download_file
from util.exception_handler import exception_handler


def create_dataframe(
    dataframe: Output[Dataset],
    file_type: str,
    databag_id: str,
):
    handler = functools.partial(
        update_databag_status,
        databag_id,
    )
    with exception_handler(handler, StatusMessage.DATASET_COULD_NOT_BE_READ):
        databag = get_databag_by_id(databag_id)
        with tempfile.NamedTemporaryFile() as tmp_file:
            with open(tmp_file.name, "wb") as output_file:
                download_file(databag.dataset_url, output_file)
            df = create_df(file_type, tmp_file.name)
            save_dataframe(df, dataframe.path)
