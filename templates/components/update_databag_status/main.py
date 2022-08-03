from components.images import python_image
from components.util import build_component
from kfp.v2.dsl import Artifact


def update_databag_status(
    status: str = "",
    depends_on: Artifact = None,
    os4ml_namespace: str = "",
    bucket: str = "",
):
    from components.update_databag_status import update_databag_status

    update_databag_status(
        status, os4ml_namespace=os4ml_namespace, bucket=bucket
    )


def main():
    build_component(
        update_databag_status, base_image=python_image, file=__file__
    )


if __name__ == "__main__":
    main()
