from kfp.v2.dsl import ClassificationMetrics, Dataset, Input, Metrics, Output
from src.load.column import extract_columns
from src.load.databag import load_databag
from src.load.dataset import build_dataset
from src.ludwig.dataset import train_validate_test_split
from src.ludwig.labels import get_all_label_values, get_label_name
from src.ludwig.metrics import calculate_conf_matrix
from src.ludwig.model import build_model, train_model
from src.util.error_handler import error_handler


@error_handler
def ludwig_solver(
    dataset_file: Input[Dataset],
    databag_file: Input[Dataset],
    cls_metrics: Output[ClassificationMetrics],
    metrics: Output[Metrics],
    batch_size: int = 8,
    epochs: int = 50,
    early_stop: int = 10,
    test_split: float = 0.1,
    validation_split: float = 0.1,
    *,
    os4ml_namespace: str = "",
    solution_name: str = "",
) -> None:
    """Train a ludwig model for the dataset."""
    databag = load_databag(databag_file.path)
    columns = extract_columns(databag)
    model, model_definition = build_model(
        columns, batch_size, epochs, early_stop
    )
    dataset = build_dataset(dataset_file.path, databag, os4ml_namespace)
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
