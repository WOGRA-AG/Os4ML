import functools

from kfp.v2.dsl import ClassificationMetrics, Dataset, Input, Metrics, Output

from jobmanager.solution import error_status_update, status_update
from load.databag import load_databag
from load.dataset import load_dataset
from ludwig_model.dataset import train_validate_test_split
from ludwig_model.labels import get_all_label_values, get_label_name
from ludwig_model.metrics import calculate_conf_matrix
from ludwig_model.model import build_model, train_model
from model.error_msg_key import ErrorMsgKey
from pipelines.util import StatusMessages
from util.exception_handler import exception_handler


def ludwig_solver(
    dataset_file: Input[Dataset],
    databag_file: Input[Dataset],
    cls_metrics: Output[ClassificationMetrics],
    metrics: Output[Metrics],
    solution_name: str,
    os4ml_namespace: str,
    batch_size: int,
    epochs: int,
    early_stop: int,
    test_split: float,
    validation_split: float,
) -> None:
    """Train a ludwig model for the dataset."""
    handler = functools.partial(
        error_status_update, solution_name, os4ml_namespace=os4ml_namespace
    )
    with exception_handler(handler, ErrorMsgKey.TRAINING_FAILED):
        databag = load_databag(databag_file.path)
        solution = status_update(
            solution_name, StatusMessages.running.value, os4ml_namespace
        )
        model, model_definition = build_model(
            solution, databag.columns, batch_size, epochs, early_stop
        )
        dataset = load_dataset(dataset_file.path)
        df_train, df_validate, df_test = train_validate_test_split(
            dataset, test_split, validation_split
        )
        train_model(model, df_train, df_validate, df_test)
        evaluate_model(
            model, model_definition, dataset, df_test, metrics, cls_metrics
        )


def evaluate_model(
    model, model_definition, dataset, df_test, metrics, cls_metrics
):
    label_name = get_label_name(model_definition)
    label_values = get_all_label_values(dataset, label_name)

    stats, pred, _ = model.evaluate(df_test, collect_predictions=True)

    accuracy = float(stats[label_name]["accuracy"])
    metrics.log_metric("accuracy", accuracy)

    conf_matrix = calculate_conf_matrix(
        pred, label_name, df_test, label_values
    )
    cls_metrics.log_confusion_matrix(label_values, conf_matrix)
