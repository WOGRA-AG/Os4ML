from typing import NamedTuple

from components.images import python_image
from components.util import build_component


def get_file_and_dataset_type(
        file_name: str,
        databag_id: str,
        os4ml_namespace: str,
) -> NamedTuple("Types", [("file_type", str), ("dataset_type", str)]):
    from components.get_file_and_dataset_type import get_file_and_dataset_type

    return get_file_and_dataset_type(
        file_name=file_name,
        databag_id=databag_id,
        os4ml_namespace=os4ml_namespace,
    )


def main():
    build_component(
        get_file_and_dataset_type,
        base_image=python_image,
        file=__file__,
    )


if __name__ == "__main__":
    main()
