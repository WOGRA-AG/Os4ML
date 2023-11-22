import logging
import subprocess
import tempfile

import pandas as pd

from build.model_manager_client.model.databag import Databag
from load.dataframe import load_dataframe, save_dataframe
from model_manager.databags import (
    download_dataset,
    get_databag_by_id,
    update_databag,
    upload_dataframe,
)
from models.status_message import StatusMessage
from sniffle.sniffle import create_columns_of_databag, get_num_rows


def execute_dataframe_script(
    databag_id: str,
    max_categories: int,
):
    databag = get_databag_by_id(databag_id)
    with tempfile.NamedTemporaryFile() as script:
        with tempfile.NamedTemporaryFile() as dataframe_file:
            with open(script.name, "wb") as script_file:
                download_dataset(script_file, databag)
            command = [
                "python",
                script.name,
                "--output",
                dataframe_file.name,
            ]
            logging.info(f"Executing script: {command}")
            subprocess.run(command)
            df = load_dataframe(dataframe_file.name)
            columns = create_columns_of_databag(df, max_categories)
            databag.number_rows = get_num_rows(columns)
            databag.number_columns = len(columns)
            databag.columns = columns
            databag.status = StatusMessage.DATABAG_DONE.value
            update_databag(databag, completed=True)
            upload_dataframe_to_databag(df, databag)


def upload_dataframe_to_databag(df: pd.DataFrame, databag: Databag) -> None:
    with tempfile.NamedTemporaryFile() as file:
        save_dataframe(df, file.name)
        with open(file.name, "rb") as upload_file:
            upload_dataframe(upload_file, databag)
