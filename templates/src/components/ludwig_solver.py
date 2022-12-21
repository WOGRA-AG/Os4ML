import functools
import os
import tempfile
import zipfile

from kfp.v2.dsl import ClassificationMetrics, Dataset, Input, Metrics, Output
from ludwig.api import LudwigModel

from config import IMAGE_COL_NAME, MODEL_DIR_NAME
from load.databag import load_databag
from load.dataframe import load_dataframe, load_image_file
from ludwig_model.dataset import train_validate_test_split
from ludwig_model.labels import get_all_label_values, get_label_name
from ludwig_model.metrics import calculate_conf_matrix
from ludwig_model.model import build_model, train_model
from model_manager.solutions import (
    update_solution_error_status,
    update_solution_status,
    upload_model,
)
from models.status_message import StatusMessage
from util.exception_handler import exception_handler


def ludwig_solver(
    dataset_file: Input[Dataset],
    databag_file: Input[Dataset],
    cls_metrics: Output[ClassificationMetrics],
    metrics: Output[Metrics],
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
        databag = load_databag(databag_file.path)
        solution = update_solution_status(
            solution_id, StatusMessage.SOLVER_RUNNING
        )
        model, model_definition = build_model(
            solution, databag.columns, batch_size, epochs, early_stop
        )
        dataframe = load_dataframe(dataset_file.path)
        if IMAGE_COL_NAME in dataframe:
            image_file_path = load_image_file(databag)
            dataframe[IMAGE_COL_NAME] = dataframe[IMAGE_COL_NAME].map(
                functools.partial(os.path.join, image_file_path)
            )
        df_train, df_validate, df_test = train_validate_test_split(
            dataframe, test_split, validation_split
        )
        train_model(model, df_train, df_validate, df_test)
        evaluate_model(
            model, model_definition, dataframe, df_test, metrics, cls_metrics
        )
        upload_model_to_solution(model, solution_id)


def evaluate_model(
    model, model_definition, dataset, df_test, metrics, cls_metrics
):
    label_name = get_label_name(model_definition)
    label_values = get_all_label_values(dataset, label_name)

    stats, pred, _ = model.evaluate(df_test, collect_predictions=True)

    y_true = df_test[label_name].dropna()
    y_pred = pred[pred.columns[0]]

    label_stats = stats[label_name]
    if "accuracy" in label_stats:
        accuracy = float(label_stats["accuracy"])
        metrics.log_metric("accuracy", accuracy)

        conf_matrix = calculate_conf_matrix(y_true, y_pred, label_values)
        cls_metrics.log_confusion_matrix(label_values, conf_matrix)
    if "r2" in label_stats:
        r2_score = float(max(0, label_stats["r2"]))
        metrics.log_metric("r2_score", r2_score)


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
