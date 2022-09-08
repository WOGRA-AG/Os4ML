from typing import NamedTuple

from kfp.v2.dsl import Artifact, Dataset

from components.images import pandas_image
from components.util import build_component


def init_databag(
    file_name: str,
    bucket: str,
    databag_id: str,
    os4ml_namespace: str,
    solution_name: str,
    depends_on: Artifact = None,
) -> NamedTuple("DatabagInfo", [("databag_type", str), ("dataset", Dataset)]):
    from components.init_databag import init_databag

    return init_databag(
        file_name=file_name,
        bucket=bucket,
        databag_id=databag_id,
        solution_name=solution_name,
        os4ml_namespace=os4ml_namespace,
    )


def main():
    build_component(
        init_databag,
        base_image=pandas_image,
        file=__file__,
    )


if __name__ == "__main__":
    main()
