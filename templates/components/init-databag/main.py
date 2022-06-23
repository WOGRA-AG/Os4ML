from typing import NamedTuple

from components.images import pandas_image
from kfp.v2.dsl import Dataset, component


def init_databag(
    bucket: str, file_name: str, solution_name: str = ""
) -> NamedTuple("DatabagInfo", [("databag_type", str), ("dataset", Dataset)]):
    from src.components.init_databag import init_databag

    return init_databag(file_name, bucket=bucket, solution_name=solution_name)


if __name__ == "__main__":
    component(
        init_databag,
        base_image=pandas_image,
        output_component_file="component.yaml",
    )
