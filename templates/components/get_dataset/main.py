from kfp.v2.dsl import Dataset, Output

from components.build import build_component
from components.images import python_image


def get_dataset(
    dataset_type: str,
    databag_id: str,
    dataset: Output[Dataset],
):
    from components.get_dataset import get_dataset

    return get_dataset(
        dataset_type=dataset_type,
        databag_id=databag_id,
        dataset=dataset,
    )


def main():
    build_component(get_dataset, base_image=python_image, file=__file__)


if __name__ == "__main__":
    main()
