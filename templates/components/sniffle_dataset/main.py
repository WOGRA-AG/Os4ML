from kfp.v2.dsl import Dataset, Input

from components.build import build_component
from components.images import pandas_image


def sniffle_dataset(
    dataframe: Input[Dataset],
    max_categories: int,
    databag_id: str,
):
    from components.sniffle_dataset import sniffle_dataset

    return sniffle_dataset(
        dataframe=dataframe,
        max_categories=max_categories,
        databag_id=databag_id,
    )


def main():
    build_component(
        sniffle_dataset,
        base_image=pandas_image,
        file=__file__,
    )


if __name__ == "__main__":
    main()
