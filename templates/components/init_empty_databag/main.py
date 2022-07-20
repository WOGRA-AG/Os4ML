from components.util import build_component
from components.images import python_image
from kfp.v2.dsl import Artifact


def init_empty_databag(
        file_name: str,
        bucket: str,
        os4ml_namespace: str,
) -> Artifact:
    from src.components.init_empty_databag import init_empty_databag
    return init_empty_databag(file_name=file_name, bucket=bucket, os4ml_namespace=os4ml_namespace)


def main():
    build_component(
        init_empty_databag,
        base_image=python_image,
        file=__file__,
    )


if __name__ == "__main__":
    main()
