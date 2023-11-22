from datetime import datetime
from typing import IO

from build.model_manager_client.model.databag import Databag
from config import DATE_FORMAT_STR, USER_TOKEN
from model_manager.init_api_client import model_manager
from models.status_message import StatusMessage
from util.download import download_file
from util.upload import put_file_to_url


def get_databag_by_id(databag_id: str) -> Databag:
    return model_manager.get_databag_by_id(databag_id, usertoken=USER_TOKEN)


def update_databag(databag: Databag, completed=False) -> None:
    if completed:
        databag.completion_time = datetime.utcnow().strftime(DATE_FORMAT_STR)
    model_manager.update_databag_by_id(
        databag.id, databag=databag, usertoken=USER_TOKEN
    )


def update_databag_status(databag_id: str, status: StatusMessage) -> Databag:
    databag = model_manager.get_databag_by_id(databag_id, usertoken=USER_TOKEN)
    databag.status = status.value
    model_manager.update_databag_by_id(
        databag_id, databag=databag, usertoken=USER_TOKEN
    )
    return databag


def download_dataset(dataset: IO[bytes], databag: Databag) -> None:
    url = model_manager.get_dataset_get_url(databag.id, usertoken=USER_TOKEN)
    download_file(url, dataset)


def download_dataframe(dataframe: IO[bytes], databag: Databag) -> None:
    url = model_manager.get_dataframe_get_url(databag.id, usertoken=USER_TOKEN)
    download_file(url, dataframe)


def upload_dataframe(dataframe: IO[bytes], databag: Databag) -> None:
    url = model_manager.create_dataframe_put_url(
        databag.id, usertoken=USER_TOKEN
    )
    put_file_to_url(url, dataframe)
