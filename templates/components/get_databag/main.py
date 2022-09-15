from kfp.v2.dsl import Dataset

from components.images import python_image
from components.util import build_component


def get_databag(
    databag_id: str, os4ml_namespace: str, solution_name: str
) -> Dataset:
    from components.get_databag import get_databag

    return get_databag(
        databag_id=databag_id,
        solution_name=solution_name,
        os4ml_namespace=os4ml_namespace,
    )


def main():
    build_component(get_databag, base_image=python_image, file=__file__)


if __name__ == "__main__":
    main()
