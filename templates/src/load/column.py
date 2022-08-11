from typing import List

from build.objectstore.model.column import Column


def extract_columns(databag) -> List[Column]:
    return [
        Column.from_json(column_dict) for column_dict in databag["columns"]
    ]
