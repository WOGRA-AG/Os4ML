from kfp.v2.dsl import Dataset, Input

from components.images import pandas_image
from components.build import build_component


def sniffle_dataset(
    dataset: Input[Dataset],
    dataset_type: str,
    max_categories: int,
    databag_id: str,
) -> Dataset:
    from components.sniffle_dataset import sniffle_dataset

    return sniffle_dataset(
        dataset=dataset,
        dataset_type=dataset_type,
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
