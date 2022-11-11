from typing import IO

from build.model_manager_client.model.databag import Databag
from config import USER_TOKEN
from model_manager.init_api_client import init_model_manager_client
from models.error_msg_key import ErrorMsgKey


def get_databag_by_id(databag_id: str) -> Databag:
    model_manager = init_model_manager_client()
    return model_manager.get_databag_by_id(databag_id, usertoken=USER_TOKEN)


def update_databag(databag: Databag) -> None:
    model_manager = init_model_manager_client()
    model_manager.update_databag_by_id(
        databag.databag_id, databag=databag, usertoken=USER_TOKEN
    )


def update_databag_status(
    databag_id: str, status: str
) -> Databag:
    model_manager = init_model_manager_client()
    databag = model_manager.get_databag_by_id(databag_id, usertoken=USER_TOKEN)
    databag.status = status
    model_manager.update_databag_by_id(
        databag_id, databag=databag, usertoken=USER_TOKEN
    )
    return databag


def update_databag_error_status(
    databag_id: str, error_msg_key: ErrorMsgKey
) -> None:
    model_manager = init_model_manager_client()
    databag = model_manager.get_databag_by_id(databag_id, usertoken=USER_TOKEN)
    databag.status = "error"
    databag.error_msg_key = error_msg_key.value
    model_manager.update_databag_by_id(
        databag_id, databag=databag, usertoken=USER_TOKEN
    )


def get_dataset_download_url(databag: Databag) -> str:
    model_manager = init_model_manager_client()
    return model_manager.download_dataset(
        databag.databag_id, usertoken=USER_TOKEN
    )


def get_dataframe_download_url(databag: Databag) -> str:
    model_manager = init_model_manager_client()
    return model_manager.download_dataframe(
        databag.databag_id, usertoken=USER_TOKEN
    )


def upload_dataframe(
    dataframe: IO[bytes], databag: Databag
) -> None:
    model_manager = init_model_manager_client()
    model_manager.upload_dataframe(
        databag.databag_id, body=dataframe, usertoken=USER_TOKEN
    )
