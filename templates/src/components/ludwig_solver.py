import functools
import os
import statistics
import tempfile
import zipfile

from kfp.v2.dsl import Dataset, Input
from ludwig.api import LudwigModel

from build.model_manager_client.models import Metric, Metrics, Solution
from config import MODEL_DIR_NAME
from load.databag import load_databag
from load.dataframe import load_dataframe
from ludwig_model.dataset import train_validate_test_split
from ludwig_model.model import build_model, train_model
from model_manager.solutions import (
    update_solution,
    update_solution_error_status,
    update_solution_status,
    upload_model,
)
from models.status_message import StatusMessage
from util.exception_handler import exception_handler


def ludwig_solver(
    dataframe: Input[Dataset],
    databag: Input[Dataset],
    solution_id: str,
    batch_size: int,
    epochs: int,
    early_stop: int,
    test_split: float,
    validation_split: float,
) -> None:
    """Train a ludwig model for the dataset."""
    handler = functools.partial(
        update_solution_error_status,
        solution_id,
    )
    with exception_handler(handler, StatusMessage.TRAINING_FAILED):
        databag_model = load_databag(databag.path)
        solution = update_solution_status(
            solution_id, StatusMessage.SOLVER_RUNNING
        )
        model, _ = build_model(
            solution, databag_model.columns, batch_size, epochs, early_stop
        )
        df_full = load_dataframe(dataframe.path or "")
        df_train, df_validate, df_test = train_validate_test_split(
            df_full, test_split, validation_split
        )
        train_model(model, df_train, df_validate, df_test)
        solution = evaluate_model(model, solution, df_test)
        upload_model_to_solution(model, solution_id)
        solution.status = StatusMessage.SOLVER_DONE.value
        update_solution(solution, completed=True)


def evaluate_model(
    model: LudwigModel, solution: Solution, df_test
) -> Solution:
    details = [
        evaluate_output_field(output_field, model, df_test)
        for output_field in solution.output_fields
    ]
    combined = statistics.mean(metric.value for metric in details)
    solution.metrics = Metrics(combined=combined, details=details)
    return solution


def evaluate_output_field(name: str, model: LudwigModel, df_test) -> Metric:
    stats, *_ = model.evaluate(df_test, collect_predictions=True)
    label_stats = stats[name]
    if "accuracy" in label_stats:
        accuracy = float(label_stats["accuracy"])
        return Metric(output_field=name, name="accuracy", value=accuracy)
    if "r2" in label_stats:
        r2_score = float(max(0, label_stats["r2"]))
        return Metric(output_field=name, name="r2_score", value=r2_score)
    raise ValueError(f"No Metric found in {stats}")


def upload_model_to_solution(
    model: LudwigModel,
    solution_id: str,
) -> None:
    with tempfile.TemporaryDirectory() as temp:
        model.save(temp)
        with tempfile.NamedTemporaryFile() as zip_file:
            zip_dir(temp, zip_file.name)
            with open(zip_file.name, "rb") as binary_zip:
                upload_model(binary_zip, solution_id)


def zip_dir(dir_: str, zip_file: str) -> None:
    with zipfile.ZipFile(zip_file, "w", zipfile.ZIP_DEFLATED) as zipped:
        for root, _, files in os.walk(dir_):
            for file in files:
                zipped.write(
                    os.path.join(root, file),
                    arcname=os.path.join(MODEL_DIR_NAME, file),
                )
