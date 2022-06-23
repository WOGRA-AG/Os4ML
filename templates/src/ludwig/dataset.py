from typing import Tuple

import pandas as pd
from sklearn.model_selection import train_test_split


def train_validate_test_split(
    dataset: pd.DataFrame,
    test_size: float,
    validation_size: float,
    random_state: int = 42,
) -> Tuple[pd.DataFrame, pd.DataFrame, pd.DataFrame]:
    df_tmp, df_test = train_test_split(
        dataset, test_size=test_size, random_state=random_state
    )
    df_train, df_validate = train_test_split(
        df_tmp, test_size=validation_size, random_state=random_state
    )
    return df_train, df_validate, df_test
