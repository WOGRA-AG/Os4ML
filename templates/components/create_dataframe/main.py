from kfp.v2.dsl import Dataset, Output

from components.build import build_component
from components.images import pandas_image


def create_dataframe(
    dataframe: Output[Dataset],
    file_type: str,
    databag_id: str,
):
    from components.create_dataframe import create_dataframe

    return create_dataframe(
        dataframe=dataframe,
        file_type=file_type,
        databag_id=databag_id,
    )


def main():
    build_component(create_dataframe, base_image=pandas_image, file=__file__)


if __name__ == "__main__":
    main()
