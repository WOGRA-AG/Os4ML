from typing import NamedTuple

from kfp.v2.dsl import component, Dataset


def create_dataframe(bucket: str, file_name: str) -> NamedTuple('DatabagInfo',
                                                                [('databag_type', str),
                                                                 ('databag_file', str),
                                                                 ('dataframe', Dataset),
                                                                 ]):
    """
    Creates a dataframe from the file in the object store.
    :param bucket: bucket of the file
    :param file_name: name of the file
    :return: returns databag_type, databag_file, dataframe
    For local_file databags the databag_file is None.
    For zip_file databags the databag_file is the location of the zip_file.
    The zip_file should only contain directories. The names of them are the labels
    and the files in them are the features.
    """
    import pandas as pd
    import pathlib
    import zipfile
    import enum
    import requests
    import tempfile
    import io
    from typing import BinaryIO
    from collections.abc import Generator

    class DatabagTypes(str, enum.Enum):
        local_file = 'local_file'
        zip_file = 'zip_file'

    def download_file(url: str, output_file: BinaryIO, chunk_size=128) -> None:
        response = requests.get(url, stream=True)
        for chunk in response.iter_content(chunk_size=chunk_size):
            output_file.write(chunk)

    def iter_dirs_of_zip_with_labels(zip_file: BinaryIO) -> Generator[tuple[str, str], None, None]:
        with zipfile.ZipFile(zip_file) as root:
            unpacked_root_dir = next(zipfile.Path(root).iterdir())
            for label_dir in unpacked_root_dir.iterdir():
                label = label_dir.name
                for file in label_dir.iterdir():
                    file_name = file.filename.resolve().relative_to(unpacked_root_dir.parent.filename.resolve())
                    yield str(file_name), label

    data_uri = f'http://os4ml-objectstore-manager.os4ml:8000/apis/v1beta1/objectstore/{bucket}/object/{file_name}'
    file_path = pathlib.Path(file_name)
    match file_path.suffix:
        case '.csv':
            df = pd.read_csv(data_uri)
            databag_type, databag_file = DatabagTypes.local_file, ''
        case '.xls' | '.xlsx' | '.xlsm' | '.xlsb' | '.odf' | '.ods':
            df = pd.read_excel(data_uri, sheet_name=0)
            databag_type, databag_file = DatabagTypes.local_file, ''
        case '.zip':
            with tempfile.NamedTemporaryFile() as tmp_file:
                download_file(data_uri, tmp_file)
                df = pd.DataFrame(iter_dirs_of_zip_with_labels(tmp_file), columns=['file', 'label'])
            databag_type, databag_file = DatabagTypes.zip_file, data_uri
        case _:
            raise NotImplementedError()

    databag_info = NamedTuple('DatabagInfo',
                              [('databag_type', str),
                               ('databag_file', str),
                               ('dataframe', Dataset),
                               ])
    # TODO save result to bucket? -> solver has to redo this step
    with io.BytesIO() as output_dataframe:
        df.to_pickle(output_dataframe)
        return databag_info(databag_type, databag_file, output_dataframe.getvalue())


if __name__ == "__main__":
    component(create_dataframe, base_image="python:3.10.2-slim",
              output_component_file="component.yaml",
              packages_to_install=["pandas>=1.4.0", "xlrd>=2.0.1",
                                   "openpyxl>=3.0.9"])
