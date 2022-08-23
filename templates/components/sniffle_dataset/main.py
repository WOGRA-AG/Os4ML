from kfp.v2.dsl import Dataset, Input

from components.images import pandas_image
from components.util import build_component


def sniffle_dataset(
    dataset: Input[Dataset],
    dataset_type: str = "local_file",
    max_categories: int = 10,
    file_name: str = "",
    bucket: str = "",
    databag_id: str = "",
    run_id: str = "",
    os4ml_namespace: str = "",
) -> Dataset:
    from components.sniffle_dataset import sniffle_dataset

    return sniffle_dataset(
        dataset,
        dataset_type,
        max_categories,
        file_name,
        bucket=bucket,
        databag_id=databag_id,
        run_id=run_id,
    )


def main():
    build_component(
        sniffle_dataset,
        base_image=pandas_image,
        file=__file__,
    )


if __name__ == "__main__":
    main()
