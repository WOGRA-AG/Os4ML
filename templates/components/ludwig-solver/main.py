from kfp.v2.dsl import (
    ClassificationMetrics,
    Dataset,
    Input,
    Metrics,
    Output,
    component,
)


def ludwig_solver(
    dataset_file: Input[Dataset],
    databag_file: Input[Dataset],
    cls_metrics: Output[ClassificationMetrics],
    metrics: Output[Metrics],
    batch_size: int = 8,
    epochs: int = 50,
    early_stop: int = 10,
):
    import dataclasses
    import enum
    import json
    import logging
    import pathlib
    import zipfile
    from typing import BinaryIO, List

    import pandas as pd
    import requests
    from ludwig.api import LudwigModel
    from sklearn.metrics import confusion_matrix
    from sklearn.model_selection import train_test_split

    class ColumnDataType(str, enum.Enum):
        NUMERICAL = "numerical"
        DATE = "date"
        CATEGORY = "category"
        TEXT = "text"
        IMAGE = "image"

    class ColumnUsage(str, enum.Enum):
        LABEL = "label"
        FEATURE = "feature"

    class DatabagTypes(str, enum.Enum):
        local_file = "local_file"
        zip_file = "zip_file"

    @dataclasses.dataclass
    class Column:
        name: str
        type: str
        usage: str
        num_entries: int

    def build_model_definition(columns: List[Column]):
        definition = {
            "input_features": [],
            "output_features": [],
            "training": {
                "batch_size": batch_size,
                "epochs": epochs,
                "early_stop": early_stop,
            },
        }
        feature_descriptions = (
            create_feature_description(column)
            for column in columns
            if column.usage == ColumnUsage.FEATURE
        )
        label_descriptions = (
            create_label_description(column)
            for column in columns
            if column.usage == ColumnUsage.LABEL
        )
        definition["input_features"].extend(feature_descriptions)
        definition["output_features"].extend(label_descriptions)
        return definition

    def create_feature_description(feature: Column) -> dict:
        feature_desc = {
            "name": feature.name,
            "type": feature.type,
        }
        if feature.type == ColumnDataType.NUMERICAL:
            feature_desc["preprocessing"] = {"fill_value": 0}
        return feature_desc

    def create_label_description(label: Column) -> dict:
        label_type = (
            ColumnDataType.NUMERICAL
            if label.type == ColumnDataType.NUMERICAL
            else ColumnDataType.CATEGORY
        )
        return {
            "name": label.name,
            "type": label_type,
        }

    def download_file(url: str, output_file: BinaryIO, chunk_size=128) -> None:
        response = requests.get(url, stream=True)
        for chunk in response.iter_content(chunk_size=chunk_size):
            output_file.write(chunk)

    def path_to_absolute(rel_path: str):
        rel = pathlib.Path(rel_path)
        return str(rel.resolve())

    def download_zip(output):
        bucket = databag["bucket_name"]
        file_name = databag["file_name"]
        url = f"http://os4ml-objectstore-manager.os4ml:8000/apis/v1beta1/objectstore/{bucket}/object/{file_name}"
        with open(output, "wb") as output_file:
            download_file(url, output_file)

    with open(databag_file.path) as file:
        databag = json.load(file)

    columns = [Column(**column_dict) for column_dict in databag["columns"]]

    model_definition = build_model_definition(columns)
    model = LudwigModel(model_definition, logging_level=logging.INFO)

    with open(dataset_file.path, "r") as input_file:
        dataset = pd.read_csv(input_file)

    if databag["dataset_type"] == DatabagTypes.zip_file:
        zip_file = "dataset.zip"
        download_zip(zip_file)
        with zipfile.ZipFile(zip_file) as ds_zip:
            ds_zip.extractall()
        dataset["file"] = dataset["file"].map(path_to_absolute)

    df_tmp, df_test = train_test_split(dataset, test_size=0.1, random_state=42)
    df_train, df_validate = train_test_split(
        df_tmp, test_size=0.1, random_state=42
    )
    label = model_definition["output_features"][0]["name"]
    categories = dataset[label].unique().astype(str)

    model.train(df_train, df_validate, df_test)
    stats, pred, _ = model.evaluate(df_test, collect_predictions=True)

    accuracy = float(stats[label]["accuracy"])

    prediction_key = next(iter(pred))
    y_pred = pred[prediction_key]
    y_true = df_test[label].astype(str)
    conf_matrix = confusion_matrix(y_true, y_pred, labels=categories).tolist()

    metrics.log_metric("accuracy", accuracy)
    cls_metrics.log_confusion_matrix(categories, conf_matrix)


if __name__ == "__main__":
    component(
        ludwig_solver,
        base_image="gitlab-registry.wogra.com/developer/wogra/os4ml/"
        "template-ludwig:164-genimgsol-databag-aus-bildern-erzeugen",
        # TODO remove branch tag
        output_component_file="component.yaml",
    )
