import functools
import pathlib
import tempfile
import zipfile

import pandas as pd

from build.model_manager_client.model.databag import Databag
from build.model_manager_client.model.solution import Solution
from load.dataframe import build_dataframe
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
    df = build_dataframe(databag, file_type.value)[0]
    df = make_template_df(df, solution)

    with tempfile.NamedTemporaryFile(suffix=".csv") as tmp_file:
        df.to_csv(tmp_file.name, index=False)
        with open(tmp_file.name, "rb") as file:
            upload_prediction_template(file, solution.id, file_name)


def create_excel_prediciton_template(
    databag: Databag, file_type: FileType, solution: Solution, file_name: str
) -> None:
    df = build_dataframe(databag, file_type.value)[0]
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
    df, zip_file = build_dataframe(databag, file_type.value)
    assert zip_file is not None
    with tempfile.TemporaryDirectory() as extract_dir:
        zip_file.extractall(extract_dir)
        with tempfile.NamedTemporaryFile(suffix=".zip") as output_file:
            make_zip(df, pathlib.Path(extract_dir), output_file.name, solution)
            with open(output_file.name, "rb") as file:
                upload_prediction_template(file, solution.id, file_name)


def make_zip(
    df: pd.DataFrame,
    extracted_input_zip_dir: pathlib.Path,
    output_zip_name: str,
    solution: Solution,
) -> None:
    template_df = make_template_df(df, solution)
    with zipfile.ZipFile(output_zip_name, "w") as output_zip:
        with tempfile.NamedTemporaryFile(suffix=".csv") as data_file:
            template_df.to_csv(data_file.name, index=False)
            output_zip.write(data_file.name, arcname="data.csv")
        for col in template_df:
            type = sniff_series(template_df[col], max_categories=1)
            if type != ColumnDataType.TEXT:
                continue
            test_file = extracted_input_zip_dir / template_df[col][0]
            if test_file not in extracted_input_zip_dir.iterdir():
                continue
            for file in template_df[col]:
                output_zip.write(extracted_input_zip_dir / file, arcname=file)


def create_prediction_script(
    databag: Databag, solution: Solution, file_name: str
) -> None:
    with tempfile.NamedTemporaryFile() as tmp_file:
        with open(tmp_file.name, "wb") as file:
            download_dataset(file, databag)
        with open(tmp_file.name, "rb") as file:
            upload_prediction_template(file, solution.id, file_name)
