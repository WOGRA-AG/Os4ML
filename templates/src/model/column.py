from __future__ import annotations

import dataclasses
from typing import Dict

from src.util.camel_snake_case import camel_to_snake


@dataclasses.dataclass
class Column:
    name: str
    type: str
    usage: str
    num_entries: int

    @classmethod
    def from_json(cls, json_dict: Dict):
        snake_case_dict = {
            camel_to_snake(key): value for key, value in json_dict.items()
        }
        return Column(**snake_case_dict)
