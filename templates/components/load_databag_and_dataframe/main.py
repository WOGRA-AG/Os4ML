from kfp.v2.dsl import Artifact, Dataset, Output

from components.build import build_component
from components.images import pandas_image


def load_databag_and_dataframe(
    dataframe: Output[Dataset],
    databag: Output[Artifact],
    solution_id: str,
):
    from components.load_databag_and_dataframe import (
        load_databag_and_dataframe,
    )

    return load_databag_and_dataframe(
        dataframe=dataframe,
        databag=databag,
        solution_id=solution_id,
    )


def main():
    build_component(
        load_databag_and_dataframe, base_image=pandas_image, file=__file__
    )


if __name__ == "__main__":
    main()
