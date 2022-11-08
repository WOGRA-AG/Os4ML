import functools
import zipfile
from typing import Generator, Tuple

import pandas as pd
from kfp.v2.dsl import Dataset, Input, Output

from exceptions.file_type_unknown import FileTypeUnknownException
from model_manager.databags import update_databag_error_status
from models.error_msg_key import ErrorMsgKey
from models.file_type import FileType
from util.exception_handler import exception_handler


def create_dataframe(
    dataset: Input[Dataset],
    dataframe: Output[Dataset],
    file_type: str,
    databag_id: str,
    os4ml_namespace: str,
):
    handler = functools.partial(
        update_databag_error_status,
        databag_id,
        os4ml_namespace=os4ml_namespace,
    )
    with exception_handler(handler, ErrorMsgKey.DATASET_COULD_NOT_BE_READ):
        if file_type == FileType.CSV:
            df = pd.read_csv(dataset.path)
        elif file_type == FileType.EXCEL:
            df = pd.read_excel(dataset.path, sheet_name=0)
        elif file_type == FileType.ZIP:
            df = pd.DataFrame(
                iter_dirs_of_zip_with_labels(dataset.path),
                columns=["file", "label"],
            )
        else:
            raise FileTypeUnknownException()
        with open(dataframe.path, "wb") as dataframe_file:
            df.to_csv(dataframe_file, index=False)


def iter_dirs_of_zip_with_labels(
    zip_file: str,
) -> Generator[Tuple[str, str], None, None]:
    with zipfile.ZipFile(zip_file) as root:
        unpacked_root_dir = next(zipfile.Path(root).iterdir())
        for label_dir in unpacked_root_dir.iterdir():
            label = label_dir.name
            for file in label_dir.iterdir():
                file_name = file.filename.resolve().relative_to(
                    unpacked_root_dir.parent.filename.resolve()
                )
                yield str(file_name), label
