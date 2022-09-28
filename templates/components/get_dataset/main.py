from kfp.v2.dsl import Dataset, Output

from components.images import python_image
from components.util import build_component


def get_dataset(
        dataset_type: str,
        file_name: str,
        bucket: str,
        databag_id: str,
        os4ml_namespace: str,
        dataset: Output[Dataset]
):
    from components.get_dataset import get_dataset

    return get_dataset(
        dataset_type=dataset_type,
        file_name=file_name,
        bucket=bucket,
        databag_id=databag_id,
        os4ml_namespace=os4ml_namespace,
        dataset=dataset,
    )


def main():
    build_component(get_dataset, base_image=python_image, file=__file__)


if __name__ == "__main__":
    main()
