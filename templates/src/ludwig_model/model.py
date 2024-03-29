import enum
import logging
from typing import Dict, List, Tuple

from ludwig.api import LudwigModel

from build.model_manager_client.model.column import Column
from build.model_manager_client.model.solution import Solution
from models.column_data_type import ColumnDataType


class TransferlearningOrigin(enum.Enum):
    HUGGING_FACE = "hugging_face"
    SOLUTION = "solution"


def build_model(
    solution: Solution,
    columns: List[Column],
    batch_size: int,
    epochs: int,
    early_stop: int,
) -> Tuple[LudwigModel, Dict]:
    model_definition = build_model_definition(
        solution, columns, batch_size, epochs, early_stop
    )
    return (
        LudwigModel(model_definition, logging_level=logging.INFO),
        model_definition,
    )


def train_model(model, df_train, df_validate, df_test):
    model.train(df_train, df_validate, df_test)


def build_model_definition(
    solution: Solution,
    columns: List[Column],
    batch_size: int,
    epochs: int,
    early_stop: int,
) -> dict:
    feature_descriptions = [
        create_feature_description(column, solution)
        for column in columns
        if column.name in solution.input_fields
    ]
    label_descriptions = [
        create_label_description(column)
        for column in columns
        if column.name in solution.output_fields
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


def create_feature_description(feature: Column, solution: Solution) -> dict:
    feature_desc = {
        "name": feature.name,
        "type": feature.type,
    }
    if feature.type == ColumnDataType.NUMERICAL:
        feature_desc["preprocessing"] = {"fill_value": 0}
    if solution.transfer_learning_settings:
        matching_settings = [
            setting
            for setting in solution.transfer_learning_settings
            if setting.name == feature.name
        ]
        if matching_settings:
            setting = matching_settings[0]
            if (
                setting.selected_transfer_learning_model.origin
                == TransferlearningOrigin.HUGGING_FACE.value
            ):
                feature_desc[
                    "encoder"
                ] = setting.selected_transfer_learning_model.value
    return feature_desc


def create_label_description(label: Column) -> dict:
    label_type = (
        ColumnDataType.NUMERICAL
        if label.type == ColumnDataType.NUMERICAL
        else ColumnDataType.CATEGORY
    )
    return {
        "name": label.name,
        "type": label_type.value,
    }
