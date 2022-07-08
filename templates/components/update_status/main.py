from kfp.v2.dsl import Artifact

from components.images import python_image
from components.util import build_component


def update_status(
        status: str = "",
        depends_on: Artifact = None,
        os4ml_namespace: str = "",
        solution_name: str = "",
):
    from src.components.update_status import update_status

    update_status(
        status, os4ml_namespace=os4ml_namespace, solution_name=solution_name
    )


def main():
    build_component(
        update_status,
        base_image=python_image,
        file=__file__
    )


if __name__ == "__main__":
    main()
