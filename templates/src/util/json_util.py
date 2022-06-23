import json
from typing import Dict

from src.util.camel_snake_case import camel_to_snake


def snake_case_json_dumps(dict_: Dict) -> str:
    return json.dumps(
        {camel_to_snake(key): value for key, value in dict_.items()}
    )
