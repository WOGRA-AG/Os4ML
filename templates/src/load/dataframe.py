import zipfile

import pandas as pd

from build.model_manager_client.model.databag import Databag
from model_manager.databags import get_dataset_download_url
from util.download import download_file


def load_dataframe(dataframe_file_path) -> pd.DataFrame:
    with open(dataframe_file_path) as input_file:
        return pd.read_csv(input_file)


def load_image_file(databag: Databag) -> None:
    download_url = get_dataset_download_url(databag)
    zip_file_name = "dataset.zip"
    with open(zip_file_name, "wb") as file:
        download_file(download_url, file)
    with zipfile.ZipFile(zip_file_name) as zip_file:
        zip_file.extractall()
