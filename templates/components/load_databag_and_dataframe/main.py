from kfp.v2.dsl import Artifact, Dataset, Output

from components.images import pandas_image
from components.build import build_component


def load_databag_and_dataframe(
    dataframe: Output[Dataset],
    databag: Output[Artifact],
    databag_id: str,
    solution_name: str,
):
    from components.load_databag_and_dataframe import (
        load_databag_and_dataframe,
    )

    return load_databag_and_dataframe(
        dataframe_output=dataframe,
        databag_output=databag,
        databag_id=databag_id,
        solution_name=solution_name,
    )


def main():
    build_component(
        load_databag_and_dataframe, base_image=pandas_image, file=__file__
    )


if __name__ == "__main__":
    main()
