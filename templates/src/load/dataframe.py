from __future__ import annotations

import csv
import pathlib
import tempfile
import zipfile
from typing import IO

import pandas as pd

from build.model_manager_client.model.databag import Databag
from exceptions.data_file import (
    DataFileNotFoundException,
    TooManyDataFilesException,
)
from exceptions.file_type_unknown import FileTypeUnknownException
from file_type.file_type import file_type_from_file_name
from model_manager.databags import download_dataset
from models.file_type import FileType


def load_dataframe(path: str) -> pd.DataFrame:
    return pd.read_pickle(path)


def save_dataframe(df: pd.DataFrame, path: str) -> None:
    df.to_pickle(path)


def build_dataframe(
    databag: Databag, file_type: str
) -> tuple[pd.DataFrame, zipfile.ZipFile | None]:
    with tempfile.NamedTemporaryFile() as tmp_file:
        with open(tmp_file.name, "wb") as output_file:
            download_dataset(output_file, databag)
        return read_df(file_type, tmp_file.name)


def read_df(
    file_type: str, path: str
) -> tuple[pd.DataFrame, zipfile.ZipFile | None]:
    if file_type == FileType.CSV:
        with open(path) as file:
            return read_csv(file), None
    elif file_type == FileType.EXCEL:
        return pd.read_excel(path, sheet_name=0), None
    elif file_type == FileType.ZIP:
        with tempfile.TemporaryDirectory() as tmp_dir_name:
            return read_zip(path, pathlib.Path(tmp_dir_name))
    else:
        raise FileTypeUnknownException()


def read_csv(file: IO[str]) -> pd.DataFrame:
    # see: https://github.com/pandas-dev/pandas/issues/53035
    lines = "\n".join(file.readlines(3))
    file.seek(0)
    try:
        csv.Sniffer().sniff(lines, delimiters=",;:\t ")
    except csv.Error:
        return pd.read_csv(file, sep=",", engine="python")

    return pd.read_csv(file, sep=None, engine="python")


def read_zip(
    path: str, tmp_dir: pathlib.Path
) -> tuple[pd.DataFrame, zipfile.ZipFile]:
    zip_file = zipfile.ZipFile(path)
    zip_file.extractall(str(tmp_dir))
    root_dir = get_root_dir(tmp_dir)
    dataframe_file = get_dataframe_file(root_dir)
    file_type = file_type_from_file_name(dataframe_file)
    return read_df(file_type, dataframe_file)[0], zip_file


def get_root_dir(dir_: pathlib.Path) -> pathlib.Path:
    """
    Check if dir only contains 1 dir, if so return the sub_dir else return dir.
    """
    root_dir = dir_
    if sum(1 for _ in root_dir.iterdir()) == 1:
        sub_dir = root_dir / next(root_dir.iterdir())
        if sub_dir.is_dir():
            return sub_dir
    return root_dir


def get_dataframe_file(dir_: pathlib.Path) -> str:
    files = {file for file in dir_.iterdir() if file.is_file()}
    data_files = {file for file in files if is_data_file(file)}
    if len(data_files) < 1:
        raise DataFileNotFoundException()
    elif len(data_files) > 1:
        raise TooManyDataFilesException()
    return str(data_files.pop())


def is_data_file(file_name: pathlib.Path) -> bool:
    try:
        return file_type_from_file_name(str(file_name)) in (
            FileType.CSV,
            FileType.EXCEL,
        )
    except FileTypeUnknownException:
        return False
