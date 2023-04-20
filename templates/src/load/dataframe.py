import pathlib
import tempfile
import zipfile
from typing import Generator, Tuple

import numpy as np
import pandas as pd
from PIL import Image

from config import CATEGORY_COL_NAME, IMAGE_COL_NAME
from exceptions.file_type_unknown import FileTypeUnknownException
from models.file_type import FileType


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
        return create_dataframe_for_zipped_images(path)
    raise FileTypeUnknownException()


def create_dataframe_for_zipped_images(zip_file_name: str) -> pd.DataFrame:
    with tempfile.TemporaryDirectory() as tmp_dir_name:
        with zipfile.ZipFile(zip_file_name) as zip_file:
            zip_file.extractall(tmp_dir_name)
        root_dir = get_root_dir(tmp_dir_name)
        image_paths_and_labels = iter_image_paths_and_labels(root_dir)
        images_and_labels = (
            (load_image(image_path), label)
            for image_path, label in image_paths_and_labels
        )
        return pd.DataFrame(
            images_and_labels,
            columns=[IMAGE_COL_NAME, CATEGORY_COL_NAME],
        )


def get_root_dir(root_dir: str) -> pathlib.Path:
    root_dir = pathlib.Path(root_dir)
    if sum(1 for _ in root_dir.iterdir()) == 1:
        sub_dir = next(root_dir.iterdir())
        if sub_dir.is_dir():
            sub_sub_dir = next(sub_dir.iterdir())
            if sub_sub_dir.is_dir():
                root_dir = sub_dir
    return root_dir


def iter_image_paths_and_labels(
    root_dir: pathlib.Path,
) -> Generator[Tuple[pathlib.Path, str], None, None]:
    for label_dir in root_dir.iterdir():
        label = label_dir.name
        for file in label_dir.iterdir():
            yield file, label


def load_image(path: pathlib.Path) -> np.ndarray:
    img = Image.open(path)
    img = np.asarray(img)
    if img.dtype == "uint16":
        # fix for tif files, this will change with ludwig version 0.7
        img = img.astype("int64")
    if len(img.shape) == 2:
        img = np.expand_dims(img, axis=2)
    return img
