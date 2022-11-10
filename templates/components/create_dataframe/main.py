from kfp.v2.dsl import Dataset, Input, Output

from components.images import pandas_image
from components.build import build_component


def create_dataframe(
    dataset: Input[Dataset],
    dataframe: Output[Dataset],
    file_type: str,
    databag_id: str,
):
    from components.create_dataframe import create_dataframe

    return create_dataframe(
        dataset=dataset,
        dataframe=dataframe,
        file_type=file_type,
        databag_id=databag_id,
    )


def main():
    build_component(create_dataframe, base_image=pandas_image, file=__file__)


if __name__ == "__main__":
    main()
