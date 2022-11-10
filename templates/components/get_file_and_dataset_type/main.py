from typing import NamedTuple

from components.images import python_image
from components.build import build_component


def get_file_and_dataset_type(
    databag_id: str,
) -> NamedTuple("Types", [("file_type", str), ("dataset_type", str)]):
    from components.get_file_and_dataset_type import get_file_and_dataset_type

    return get_file_and_dataset_type(
        databag_id=databag_id,
    )


def main():
    build_component(
        get_file_and_dataset_type,
        base_image=python_image,
        file=__file__,
    )


if __name__ == "__main__":
    main()
