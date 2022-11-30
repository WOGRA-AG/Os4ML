import tempfile
import uuid
import zipfile

import pandas as pd

from build.model_manager_client.model.databag import Databag
from model_manager.databags import get_dataset_download_url
from util.download import download_file


def load_dataframe(dataframe_file_path) -> pd.DataFrame:
    with open(dataframe_file_path) as input_file:
        return pd.read_csv(input_file)


def load_image_file(databag: Databag) -> str:
    download_url = get_dataset_download_url(databag)
    with tempfile.NamedTemporaryFile() as zip_file_name:
        with open(zip_file_name.name, "wb") as file:
            download_file(download_url, file)
        dataset_id = uuid.uuid4()
        extract_to = f"/data/{dataset_id}"
        with zipfile.ZipFile(zip_file_name.name) as zip_file:
            zip_file.extractall(path=extract_to)
    return extract_to
