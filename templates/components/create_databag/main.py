from components.images import python_image
from components.util import build_component
from kfp.v2.dsl import Dataset, Input


def create_databag(file: Input[Dataset], bucket: str, os4ml_namespace: str):
    from components.create_databag import create_databag

    return create_databag(file, os4ml_namespace=os4ml_namespace, bucket=bucket)


def main():
    build_component(create_databag, base_image=python_image, file=__file__)


if __name__ == "__main__":
    main()
