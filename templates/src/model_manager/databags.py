from typing import IO

from build.model_manager_client.model.databag import Databag
from config import USER_TOKEN
from model_manager.init_api_client import init_model_manager_client
from models.status_message import StatusMessage


def get_databag_by_id(databag_id: str) -> Databag:
    model_manager = init_model_manager_client()
    return model_manager.get_databag_by_id(databag_id, usertoken=USER_TOKEN)


def update_databag(databag: Databag) -> None:
    model_manager = init_model_manager_client()
    model_manager.update_databag_by_id(
        databag.id, databag=databag, usertoken=USER_TOKEN
    )


def update_databag_status(databag_id: str, status: StatusMessage) -> Databag:
    model_manager = init_model_manager_client()
    databag = model_manager.get_databag_by_id(databag_id, usertoken=USER_TOKEN)
    databag.status = status.value
    model_manager.update_databag_by_id(
        databag_id, databag=databag, usertoken=USER_TOKEN
    )
    return databag


def get_dataset_download_url(databag: Databag) -> str:
    model_manager = init_model_manager_client()
    return model_manager.download_dataset(databag.id, usertoken=USER_TOKEN)


def get_dataframe_download_url(databag: Databag) -> str:
    model_manager = init_model_manager_client()
    return model_manager.download_dataframe(databag.id, usertoken=USER_TOKEN)


def upload_dataframe(dataframe: IO[bytes], databag: Databag) -> None:
    model_manager = init_model_manager_client()
    model_manager.upload_dataframe(
        databag.id, body=dataframe, usertoken=USER_TOKEN
    )
