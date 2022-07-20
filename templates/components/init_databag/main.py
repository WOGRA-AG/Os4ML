from typing import NamedTuple

from components.images import pandas_image
from components.util import build_component
from kfp.v2.dsl import Dataset, Artifact


def init_databag(
    file_name: str,
    bucket: str,
    os4ml_namespace: str,
    depends_on: Artifact = None,
    solution_name: str = "",
) -> NamedTuple("DatabagInfo", [("databag_type", str), ("dataset", Dataset)]):
    from src.components.init_databag import init_databag

    return init_databag(
        file_name,
        bucket=bucket,
        os4ml_namespace=os4ml_namespace,
        solution_name=solution_name,
    )


def main():
    build_component(
        init_databag,
        base_image=pandas_image,
        file=__file__,
    )


if __name__ == "__main__":
    main()
