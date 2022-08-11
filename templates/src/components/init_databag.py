import tempfile
import zipfile
from collections import namedtuple
from typing import BinaryIO, Generator, NamedTuple, Tuple

import pandas as pd

from model.databag_type import DatabagType
from model.file_type import FileType
from objectstore.objectstore import download_file, get_download_url
from util.error_handler import error_handler
from util.uri import extract_filename_from_uri


@error_handler
def init_databag(
    file_name: str,
    *,
    bucket: str = None,
    os4ml_namespace: str = "",
    solution_name: str = "",
) -> NamedTuple("DatabagInfo", [("databag_type", str), ("dataset", str)]):
    """
    Inits the databag by specifying its type and creating the dataset.
    If the file is a zip file it should only contain directories in the top level.
    The names of them are used as labels and the files they contain are used as features.
    """
    databag_type = DatabagType.from_uri(file_name)
    databag_info = namedtuple("DatabagInfo", ["databag_type", "dataset"])

    if databag_type == DatabagType.shepard_url:
        # TODO: Replace with real data
        df = pd.DataFrame([1], columns=["a"])
        return databag_info(databag_type.value, df.to_csv(index=False))

    elif databag_type == DatabagType.file_url:
        data_uri = file_name
        file_name = extract_filename_from_uri(file_name)
    else:
        data_uri = get_download_url(bucket, file_name, os4ml_namespace)

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
