from components.images import python_image
from kfp.v2.dsl import Dataset, component


def get_databag(
    bucket: str, os4ml_namespace: str, solution_name: str
) -> Dataset:
    from src.components.get_databag import get_databag

    return get_databag(
        bucket, os4ml_namespace=os4ml_namespace, solution_name=solution_name
    )


if __name__ == "__main__":
    component(
        get_databag,
        base_image=python_image,
        output_component_file="component.yaml",
    )
