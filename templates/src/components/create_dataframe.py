import functools
import pathlib
import zipfile
from typing import Generator, Tuple

import pandas as pd
from kfp.v2.dsl import Dataset, Input, Output

from config import CATEGORY_COL_NAME, IMAGE_COL_NAME
from exceptions.file_type_unknown import FileTypeUnknownException
from model_manager.databags import update_databag_status
from models.file_type import FileType
from models.status_message import StatusMessage
from util.exception_handler import exception_handler


def create_dataframe(
    dataset: Input[Dataset],
    dataframe: Output[Dataset],
    file_type: str,
    databag_id: str,
):
    handler = functools.partial(
        update_databag_status,
        databag_id,
    )
    with exception_handler(handler, StatusMessage.DATASET_COULD_NOT_BE_READ):
        if file_type == FileType.CSV:
            df = pd.read_csv(dataset.path)
        elif file_type == FileType.EXCEL:
            df = pd.read_excel(dataset.path, sheet_name=0)
        elif file_type == FileType.ZIP:
            df = pd.DataFrame(
                iter_dirs_of_zip_with_labels(dataset.path),
                columns=[IMAGE_COL_NAME, CATEGORY_COL_NAME],
            )
        else:
            raise FileTypeUnknownException()
        with open(dataframe.path, "wb") as dataframe_file:
            df.to_csv(dataframe_file, index=False)


def iter_dirs_of_zip_with_labels(
    zip_file: str,
) -> Generator[Tuple[str, str], None, None]:
    with zipfile.ZipFile(zip_file) as root:
        root_dir = zipfile.Path(root)
        if sum(1 for _ in root_dir.iterdir()) == 1:
            sub_dir = next(root_dir.iterdir())
            sub_sub_dir = next(root_dir.iterdir())
            if sub_sub_dir.is_dir():
                root_dir = sub_dir
        for label_dir in root_dir.iterdir():
            label = label_dir.name
            for file in label_dir.iterdir():
                abs_file_name = pathlib.Path(str(file)).resolve()
                abs_root_dir_name = pathlib.Path(
                    str(root_dir.parent)
                ).resolve()
                rel_file_name = abs_file_name.relative_to(abs_root_dir_name)
                yield str(rel_file_name), label
