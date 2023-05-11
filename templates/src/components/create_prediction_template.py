import functools
import pathlib
import tempfile
import zipfile

import pandas as pd
from kfp.v2.dsl import Dataset, Input

from build.models.databag import Databag
from build.models.solution import Solution
from load.dataframe import build_dataframe, get_root_dir, read_zip
from load.dataset import get_dataset_file_type
from model_manager.databags import get_databag_by_id
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


def create_prediction_template(dataframe: Input[Dataset], solution_id: str):
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
            create_prediciton_template(
                databag, file_type, solution, "prediction.csv"
            )
        elif file_type == FileType.EXCEL:
            create_prediciton_template(
                databag, file_type, solution, "prediction.xlsx"
            )
        elif file_type == FileType.SCRIPT:
            create_prediction_script(databag, solution, "prediction.py")


def create_prediciton_template(
    databag: Databag, file_type: FileType, solution: Solution, file_name: str
) -> None:
    df = build_dataframe(databag.dataset_url, file_type.value)
    df = make_template_df(df, solution)

    with tempfile.NamedTemporaryFile() as tmp_file:
        df.to_csv(tmp_file.name, index=False)
        with open(tmp_file.name, "rb") as file:
            upload_prediction_template(file, solution.id, file_name)


def make_template_df(df: pd.DataFrame, solution: Solution) -> pd.DataFrame:
    for output_field in solution.output_fields:
        df = df.drop(output_field, axis=1)
    return df[0:10]


def create_zip_prediction_template(
    databag: Databag, file_type: str, solution: Solution, file_name: str
) -> None:
    with tempfile.NamedTemporaryFile() as tmp_file:
        with open(tmp_file.name, "wb") as file:
            download_file(databag.dataset_url, file)
        df, _ = read_zip(tmp_file.name)
        df = make_template_df(df, solution)
        with tempfile.NamedTemporaryFile(suffix=".zip") as output_file:
            make_zip(df, tmp_file.name, output_file.name)
            with open(output_file, "rb") as file:
                upload_prediction_template(file, solution.id, file_name)


def make_zip(df: pd.DataFrame, file_path: str, zip_file_name: str) -> None:
    with tempfile.TemporaryDirectory() as tmp_dir:
        with zipfile.ZipFile(file_path) as zip_file:
            zip_file.extractall(tmp_dir)
        root_dir = get_root_dir(tmp_dir)
        with zipfile.ZipFile(zip_file_name, "w") as output_zip:
            for col in df:
                type = sniff_series(df[col])
                if type != ColumnDataType.TEXT:
                    continue
                test_file = pathlib.Path(tmp_dir.name) / df[col][0]
                if not test_file.exists():
                    continue
                for file in df[col]:
                    output_zip.write(root_dir / file)


def create_prediction_script(
    databag: Databag, solution: Solution, file_name: str
) -> None:
    with tempfile.NamedTemporaryFile() as tmp_file:
        with open(tmp_file.name, "wb") as file:
            download_file(databag.dataset_url, file)
        with open(tmp_file.name, "rb") as file:
            upload_prediction_template(file, solution.id, file_name)
