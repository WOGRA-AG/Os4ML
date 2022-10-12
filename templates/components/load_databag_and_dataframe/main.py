from kfp.v2.dsl import Artifact, Dataset, Output

from components.images import pandas_image
from components.util import build_component


def load_databag_and_dataframe(
    dataframe: Output[Dataset],
    databag: Output[Artifact],
    bucket: str,
    databag_id: str,
    os4ml_namespace: str,
    solution_name: str,
):
    from components.load_databag_and_dataframe import (
        load_databag_and_dataframe,
    )

    return load_databag_and_dataframe(
        dataframe=dataframe,
        databag=databag,
        bucket=bucket,
        databag_id=databag_id,
        os4ml_namespace=os4ml_namespace,
        solution_name=solution_name,
    )


def main():
    build_component(
        load_databag_and_dataframe, base_image=pandas_image, file=__file__
    )


if __name__ == "__main__":
    main()