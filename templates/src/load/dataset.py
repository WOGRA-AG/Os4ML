import pandas as pd


def load_dataset(dataset_file_path) -> pd.DataFrame:
    with open(dataset_file_path) as input_file:
        return pd.read_csv(input_file)
