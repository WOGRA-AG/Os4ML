import json

from build.objectstore.model.databag import Databag


def load_databag(databag_file_path) -> Databag:
    with open(databag_file_path) as file:
        databag_json = json.load(file)
    return Databag(**databag_json)
