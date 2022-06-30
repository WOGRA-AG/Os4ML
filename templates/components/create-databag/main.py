from components.images import python_image
from kfp.v2.dsl import Dataset, Input, component


def create_databag(file: Input[Dataset], bucket: str, os4ml_namespace: str):
    from src.components.create_databag import create_databag

    return create_databag(file, os4ml_namespace=os4ml_namespace, bucket=bucket)


if __name__ == "__main__":
    component(
        create_databag,
        base_image=python_image,
        output_component_file="component.yaml",
    )
