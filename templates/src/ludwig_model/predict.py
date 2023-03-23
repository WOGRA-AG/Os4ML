import pathlib
import tempfile
import zipfile
from collections.abc import Iterator

import pandas as pd
from ludwig.api import LudwigModel


def load_model(path: str) -> LudwigModel:
    with tempfile.TemporaryDirectory() as directory:
        zip_file = zipfile.ZipFile(path)
        zip_file.extractall(directory)
        dir_p = pathlib.Path(directory)
        model_dir = next(dir_p.iterdir())
        return LudwigModel.load(str(model_dir))


def predict_data(model: LudwigModel, df: pd.DataFrame) -> pd.DataFrame:
    results, _ = model.predict(df)
    return results


def combine_data_and_result(
    df: pd.DataFrame, result_df: pd.DataFrame, output_fields: Iterator[str]
) -> pd.DataFrame:
    for output_field in output_fields:
        pred_col = f"{output_field}_predictions"
        df[pred_col] = result_df[pred_col]
    return df
