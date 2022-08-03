import logging
from typing import Dict, List, Tuple

from ludwig.api import LudwigModel

from model.column import Column
from model.column_data_type import ColumnDataType
from model.column_usage import ColumnUsage


def build_model(
    columns: List[Column], batch_size: int, epochs: int, early_stop: int
) -> Tuple[LudwigModel, Dict]:
    model_definition = build_model_definition(
        columns, batch_size, epochs, early_stop
    )
    return (
        LudwigModel(model_definition, logging_level=logging.INFO),
        model_definition,
    )


def train_model(model, df_train, df_validate, df_test):
    model.train(df_train, df_validate, df_test)


def build_model_definition(
    columns: List[Column], batch_size: int, epochs: int, early_stop: int
) -> dict:
    feature_descriptions = [
        create_feature_description(column)
        for column in columns
        if column.usage == ColumnUsage.FEATURE
    ]
    label_descriptions = [
        create_label_description(column)
        for column in columns
        if column.usage == ColumnUsage.LABEL
    ]
    return {
        "input_features": feature_descriptions,
        "output_features": label_descriptions,
        "training": {
            "batch_size": batch_size,
            "epochs": epochs,
            "early_stop": early_stop,
        },
    }


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
