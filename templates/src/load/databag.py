import json

from build.model_manager_client.model.column import Column
from build.model_manager_client.model.databag import Databag


def load_databag(databag_file_path) -> Databag:
    with open(databag_file_path) as file:
        databag_dict = json.load(file)
    databag_dict["columns"] = [
        Column(**column_dict) for column_dict in databag_dict["columns"]
    ]
    return Databag(**databag_dict)
