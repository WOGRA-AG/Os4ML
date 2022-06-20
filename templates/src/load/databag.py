import json
from typing import Dict


def load_databag(databag_file_path) -> Dict:
    with open(databag_file_path) as file:
        return json.load(file)
