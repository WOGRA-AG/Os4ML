import pandas as pd


def load_dataframe(path: str) -> pd.DataFrame:
    return pd.read_pickle(path)


def save_dataframe(df: pd.DataFrame, path: str) -> None:
    df.to_pickle(path)
