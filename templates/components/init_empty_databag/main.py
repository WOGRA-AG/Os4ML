from kfp.v2.dsl import Artifact

from components.images import python_image
from components.util import build_component


def init_empty_databag(
    file_name: str,
    bucket: str,
    databag_id: str,
    run_id: str,
    os4ml_namespace: str,
) -> Artifact:
    from components.init_empty_databag import init_empty_databag

    return init_empty_databag(
        file_name=file_name,
        bucket=bucket,
        databag_id=databag_id,
        run_id=run_id,
        os4ml_namespace=os4ml_namespace,
    )


def main():
    build_component(
        init_empty_databag,
        base_image=python_image,
        file=__file__,
    )


if __name__ == "__main__":
    main()
