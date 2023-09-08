import functools
import pathlib
import tempfile
import zipfile

import pandas as pd

from build.model_manager_client.model.databag import Databag
from build.model_manager_client.model.solution import Solution
from file_type.file_type import file_type_from_file_name
from load.dataframe import (
    build_dataframe,
    get_dataframe_file,
    get_root_dir,
    read_df,
)
from load.dataset import get_dataset_file_type
from model_manager.databags import download_dataset, get_databag_by_id
from model_manager.solutions import (
    get_solution_by_id,
    update_solution_error_status,
    upload_prediction_template,
)
from models.column_data_type import ColumnDataType
from models.file_type import FileType
from models.status_message import StatusMessage
from sniffle.sniffle import sniff_series
from util.download import download_file
from util.exception_handler import exception_handler


def create_prediction_template(solution_id: str):
    handler = functools.partial(
        update_solution_error_status,
        solution_id,
    )
    with exception_handler(
        handler, StatusMessage.PREDICTION_TEMPLATE_COULD_NOT_BE_CREATED
    ):
        solution = get_solution_by_id(solution_id)
        databag = get_databag_by_id(solution.databag_id)
        file_type = get_dataset_file_type(databag)
        if file_type == FileType.ZIP:
            create_zip_prediction_template(
                databag, file_type, solution, "prediction.zip"
            )
        elif file_type == FileType.CSV:
            create_csv_prediciton_template(
                databag, file_type, solution, "prediction.csv"
            )
        elif file_type == FileType.EXCEL:
            create_excel_prediciton_template(
                databag, file_type, solution, "prediction.xlsx"
            )
        elif file_type == FileType.SCRIPT:
            create_prediction_script(databag, solution, "prediction.py")


def create_csv_prediciton_template(
    databag: Databag, file_type: FileType, solution: Solution, file_name: str
) -> None:
    df = build_dataframe(databag, file_type.value)
    df = make_template_df(df, solution)

    with tempfile.NamedTemporaryFile(suffix=".csv") as tmp_file:
        df.to_csv(tmp_file.name, index=False)
        with open(tmp_file.name, "rb") as file:
            upload_prediction_template(file, solution.id, file_name)


def create_excel_prediciton_template(
    databag: Databag, file_type: FileType, solution: Solution, file_name: str
) -> None:
    df = build_dataframe(databag, file_type.value)
    df = make_template_df(df, solution)

    with tempfile.NamedTemporaryFile(suffix=".xlsx") as tmp_file:
        df.to_excel(tmp_file.name, index=False)
        with open(tmp_file.name, "rb") as file:
            upload_prediction_template(file, solution.id, file_name)


def make_template_df(df: pd.DataFrame, solution: Solution) -> pd.DataFrame:
    for output_field in solution.output_fields:
        df = df.drop(output_field, axis=1)
    return df[0:10]


def create_zip_prediction_template(
    databag: Databag, file_type: FileType, solution: Solution, file_name: str
) -> None:
    with tempfile.NamedTemporaryFile() as tmp_file:
        with open(tmp_file.name, "wb") as file:
            download_dataset(file, databag)
        with tempfile.NamedTemporaryFile(suffix=".zip") as output_file:
            make_zip(tmp_file.name, output_file.name, solution)
            with open(output_file.name, "rb") as file:
                upload_prediction_template(file, solution.id, file_name)


def make_zip(file_path: str, zip_file_name: str, solution: Solution) -> None:
    with tempfile.TemporaryDirectory() as tmp_dir:
        with zipfile.ZipFile(file_path) as zip_file:
            zip_file.extractall(tmp_dir)
        root_dir = get_root_dir(pathlib.Path(tmp_dir))
        dataframe_file = get_dataframe_file(root_dir)
        file_type = file_type_from_file_name(dataframe_file)
        df = read_df(file_type, dataframe_file)
        df = make_template_df(df, solution)
        with zipfile.ZipFile(zip_file_name, "w") as output_zip:
            with tempfile.NamedTemporaryFile(suffix=".csv") as data_file:
                df.to_csv(data_file.name, index=False)
                arcname = pathlib.Path(dataframe_file).with_suffix(".csv").name
                output_zip.write(data_file.name, arcname=arcname)
            for col in df:
                type = sniff_series(df[col], max_categories=1)
                if type != ColumnDataType.TEXT:
                    continue
                test_file = root_dir / df[col][0]
                if not test_file.exists():
                    continue
                for file in df[col]:
                    output_zip.write(root_dir / file, arcname=str(file))


def create_prediction_script(
    databag: Databag, solution: Solution, file_name: str
) -> None:
    with tempfile.NamedTemporaryFile() as tmp_file:
        with open(tmp_file.name, "wb") as file:
            download_file(databag.dataset_url, file)
        with open(tmp_file.name, "rb") as file:
            upload_prediction_template(file, solution.id, file_name)
