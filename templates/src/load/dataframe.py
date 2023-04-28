import functools
import pathlib
import tempfile
import zipfile

import numpy as np
import pandas as pd
from PIL import Image

from exceptions.data_file import (
    DataFileNotFoundException,
    TooManyDataFilesException,
)
from exceptions.file_type_unknown import (
    FileTypeNotSupported,
    FileTypeUnknownException,
)
from file_type.file_type import file_type_from_file_name
from models.column_data_type import ColumnDataType
from models.file_type import FileType
from sniffle.sniffle import sniff_series


def load_dataframe(path: str) -> pd.DataFrame:
    return pd.read_pickle(path)


def save_dataframe(df: pd.DataFrame, path: str) -> None:
    df.to_pickle(path)


def create_df(file_type: str, path: str) -> pd.DataFrame:
    if file_type == FileType.CSV:
        return pd.read_csv(path, sep=None, engine="python")
    if file_type == FileType.EXCEL:
        return pd.read_excel(path, sheet_name=0)
    if file_type == FileType.ZIP:
        return read_zip(path)
    raise FileTypeUnknownException()


def read_zip(path: str) -> pd.DataFrame:
    with tempfile.TemporaryDirectory() as tmp_dir_name:
        with zipfile.ZipFile(path) as zip_file:
            zip_file.extractall(tmp_dir_name)
        root_dir = get_root_dir(tmp_dir_name)
        dataframe_file = get_dataframe_file(root_dir)
        file_type = file_type_from_file_name(dataframe_file)
        df = create_df(file_type, dataframe_file)
        return load_files_to_df(df, root_dir)


def get_root_dir(dir_: str) -> pathlib.Path:
    """
    Check if dir only contains 1 dir, if so return the sub_dir else return dir.
    """
    root_dir = pathlib.Path(dir_)
    if sum(1 for _ in root_dir.iterdir()) == 1:
        sub_dir = next(root_dir.iterdir())
        if sub_dir.is_dir():
            return sub_dir
    return root_dir


def get_dataframe_file(dir_: str) -> str:
    files = {file for file in pathlib.Path(dir_).iterdir() if file.is_file()}
    data_files = {file for file in files if is_data_file(file)}
    if len(data_files) < 1:
        raise DataFileNotFoundException()
    elif len(data_files) > 1:
        raise TooManyDataFilesException()
    return str(data_files.pop())


def is_data_file(file_name: str) -> bool:
    try:
        return file_type_from_file_name(file_name) in (
            FileType.CSV,
            FileType.EXCEL,
        )
    except FileTypeUnknownException:
        return False


def load_files_to_df(df: pd.DataFrame, path: str) -> pd.DataFrame:
    for col in df:
        type = sniff_series(df[col])
        if type != ColumnDataType.TEXT:
            continue
        test_file = path / df[col][0]
        if not test_file.exists():
            continue
        df[col] = df[col].apply(functools.partial(load_file, path=path))
    return df


def load_file(file: str, path: str) -> object:
    file_path = path / file
    suffix = file_path.suffix
    if suffix.lower() in (".jpg", ".jpeg", ".png", ".gif", ".bmp", ".tif"):
        return load_image(file_path)
    else:
        raise FileTypeNotSupported()


def load_image(file: pathlib.Path) -> np.ndarray:
    img = Image.open(file)
    img = np.asarray(img)
    if img.dtype == "uint16":
        # fix for tif files, this will change with ludwig version 0.7
        img = img.astype("int64")
    if len(img.shape) == 2:
        img = np.expand_dims(img, axis=2)
    return img
