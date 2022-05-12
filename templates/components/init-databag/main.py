from typing import NamedTuple

from kfp.v2.dsl import Dataset, component


def init_databag(
    bucket: str, file_name: str
) -> NamedTuple("DatabagInfo", [("databag_type", str), ("dataset", Dataset),]):
    """
    Inits the databag by specifying its type and creating the dataset.
    If the file is a zip file it should only contain directories in the top level.
    The names of them are used as labels and the files they contain are used as features.
    """
    import enum
    import pathlib
    import tempfile
    import zipfile
    from collections.abc import Generator
    from typing import BinaryIO
    from urllib.parse import urlparse

    import pandas as pd
    import requests

    class DatabagTypes(str, enum.Enum):
        local_file = "local_file"
        zip_file = "zip_file"
        file_url = "file_url"
        shepard_url = "shepard_url"

    def _is_uri(uri: str) -> bool:
        parsed = urlparse(uri)
        return bool(parsed.scheme and parsed.netloc)

    def _is_shepard_uri(uri: str) -> bool:
        if not _is_uri(uri):
            return False
        return "/shepard/api/" in uri

    def _extract_filename_from_uri(file_url):
        parsed_url = urlparse(file_url)
        return pathlib.Path(parsed_url.path).name

    def download_file(url: str, output_file: BinaryIO, chunk_size=128) -> None:
        response = requests.get(url, stream=True)
        for chunk in response.iter_content(chunk_size=chunk_size):
            output_file.write(chunk)

    def iter_dirs_of_zip_with_labels(
        zip_file: BinaryIO,
    ) -> Generator[tuple[str, str], None, None]:
        with zipfile.ZipFile(zip_file) as root:
            unpacked_root_dir = next(zipfile.Path(root).iterdir())
            for label_dir in unpacked_root_dir.iterdir():
                label = label_dir.name
                for file in label_dir.iterdir():
                    file_name = file.filename.resolve().relative_to(
                        unpacked_root_dir.parent.filename.resolve()
                    )
                    yield str(file_name), label

    databag_type = None
    databag_info = NamedTuple(
        "DatabagInfo",
        [
            ("databag_type", str),
            ("dataset", Dataset),
        ],
    )

    if _is_shepard_uri(file_name):
        databag_type = DatabagTypes.shepard_url
        # TODO: Replace with real data
        df = pd.DataFrame([1], columns=["a"])
        return databag_info(databag_type.value, df.to_csv(index=False))
    elif _is_uri(file_name):
        data_uri = file_name
        file_name = _extract_filename_from_uri(file_name)
        databag_type = DatabagTypes.file_url
    else:
        data_uri = f"http://os4ml-objectstore-manager.os4ml:8000/apis/v1beta1/objectstore/{bucket}/object/{file_name}"

    file_path = pathlib.Path(file_name)
    match file_path.suffix:
        case ".csv":
            df = pd.read_csv(data_uri)
            databag_type = databag_type or DatabagTypes.local_file
        case ".xls" | ".xlsx" | ".xlsm" | ".xlsb" | ".odf" | ".ods":
            df = pd.read_excel(data_uri, sheet_name=0)
            databag_type = databag_type or DatabagTypes.local_file
        case ".zip":
            with tempfile.NamedTemporaryFile() as tmp_file:
                download_file(data_uri, tmp_file)
                df = pd.DataFrame(
                    iter_dirs_of_zip_with_labels(tmp_file),
                    columns=["file", "label"],
                )
            databag_type = DatabagTypes.zip_file
        case _:
            raise NotImplementedError()

    return databag_info(databag_type.value, df.to_csv(index=False))


if __name__ == "__main__":
    component(
        init_databag,
        base_image="python:3.10.2-slim",
        output_component_file="component.yaml",
        packages_to_install=[
            "pandas>=1.4.0",
            "xlrd>=2.0.1",
            "openpyxl>=3.0.9",
        ],
    )
