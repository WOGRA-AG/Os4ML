import zipfile

from src.kfp.dataset import load_dataset
from src.model.databag_type import DatabagType
from src.objectstore.objectstore import download_file_from_bucket
from src.util.paths import path_to_absolute


def build_dataset(dataset_file_path, databag, os4ml_namespace: str):
    dataset = load_dataset(dataset_file_path)

    if databag["dataset_type"] == DatabagType.zip_file:
        download_and_extract_zip_file(
            databag["bucket_name"], databag["file_name"], os4ml_namespace
        )
        dataset["file"] = dataset["file"].map(path_to_absolute)
    return dataset


def download_and_extract_zip_file(
    bucket_name: str, file_name: str, os4ml_namespace: str
) -> None:
    zip_file = "dataset.zip"
    download_file_from_bucket(
        bucket_name, file_name, zip_file, os4ml_namespace
    )
    with zipfile.ZipFile(zip_file) as ds_zip:
        ds_zip.extractall()
