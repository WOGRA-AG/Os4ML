import pandas as pd


def load_dataframe(dataframe_file_path) -> pd.DataFrame:
    with open(dataframe_file_path) as input_file:
        return pd.read_csv(input_file)
