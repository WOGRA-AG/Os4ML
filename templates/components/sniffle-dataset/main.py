from components.images import pandas_image
from kfp.v2.dsl import Dataset, Input, component


def sniffle_dataset(
    dataset: Input[Dataset],
    dataset_type: str = "local_file",
    max_categories: int = 10,
    file_name: str = "",
    bucket: str = "",
) -> Dataset:
    from src.components.sniffle_dataset import sniffle_dataset

    return sniffle_dataset(
        dataset,
        dataset_type,
        max_categories,
        file_name,
        bucket=bucket,
    )


if __name__ == "__main__":
    component(
        sniffle_dataset,
        base_image=pandas_image,
        output_component_file="component.yaml",
    )
