from typing import NamedTuple

from kfp.v2.dsl import Dataset, component

from components.images import python_image


def init_databag(
    bucket: str, file_name: str, solution_name: str = ""
) -> NamedTuple("DatabagInfo", [("databag_type", str), ("dataset", Dataset)]):
    from src.components.init_databag import init_databag

    return init_databag(bucket, file_name, solution_name=solution_name)


if __name__ == "__main__":
    component(
        init_databag,
        base_image=python_image,
        output_component_file="component.yaml",
    )
