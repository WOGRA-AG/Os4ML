import functools
import tempfile
import zipfile
from collections import namedtuple
from typing import BinaryIO, Generator, NamedTuple, Tuple

import pandas as pd

from exceptions.resource_not_found_exception import ResourceNotFoundException
from jobmanager.solution import error_status_update
from model.databag_type import DatabagType
from model.error_msg_key import ErrorMsgKey
from model.file_type import FileType
from objectstore.objectstore import (
    download_file,
    error_databag_status_update,
    get_download_url,
)
from util.exception_handler import exception_handler
from util.uri import extract_filename_from_uri, resource_exists


def init_databag(
    file_name: str,
    bucket: str,
    databag_id: str,
    solution_name: str,
    os4ml_namespace: str,
) -> NamedTuple("DatabagInfo", [("databag_type", str), ("dataset", str)]):
    """
    Inits the databag by specifying its type and creating the dataset.
    If the file is a zip file it should only contain directories in the top level.
    The names of them are used as labels and the files they contain are used as features.
    """
    handler = (
        functools.partial(
            error_status_update, solution_name, os4ml_namespace=os4ml_namespace
        )
        if solution_name and not solution_name == "None"
        else functools.partial(
            error_databag_status_update,
            databag_id,
            os4ml_namespace=os4ml_namespace,
        )
    )
    with exception_handler(handler, ErrorMsgKey.DATASET_NOT_FOUND):
        databag_info = namedtuple("DatabagInfo", ["databag_type", "dataset"])
        databag_type = DatabagType.from_uri(file_name)

        if databag_type == DatabagType.shepard_url:
            # TODO: Replace with real data
            df = pd.DataFrame([1], columns=["a"])
            return databag_info(databag_type.value, df.to_csv(index=False))

        elif databag_type == DatabagType.file_url:
            if not resource_exists(file_name):
                raise ResourceNotFoundException(file_name)
            data_uri = file_name
            file_name = extract_filename_from_uri(file_name)
        else:
            data_uri = get_download_url(
                bucket, f"{databag_id}/{file_name}", os4ml_namespace
            )

        file_type = FileType.from_file_name(file_name)
        if file_type == FileType.CSV:
            df = pd.read_csv(data_uri)
        elif file_type == FileType.EXCEL:
            df = pd.read_excel(data_uri, sheet_name=0)
        elif file_type == FileType.ZIP:
            with tempfile.NamedTemporaryFile() as tmp_file:
                download_file(data_uri, tmp_file)
                df = pd.DataFrame(
                    iter_dirs_of_zip_with_labels(tmp_file),
                    columns=["file", "label"],
                )
        else:
            raise NotImplementedError()
        return databag_info(databag_type.value, df.to_csv(index=False))


def iter_dirs_of_zip_with_labels(
    zip_file: BinaryIO,
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
