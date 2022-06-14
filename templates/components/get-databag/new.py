from kfp.v2.dsl import Dataset, component

from components.images import component_base_img


def get_databag(bucket: str, solution_name: str = "") -> Dataset:
    from src.components.get_databag import get_databag

    return get_databag(bucket, solution_name=solution_name)


if __name__ == "__main__":
    component(
        get_databag,
        base_image=component_base_img,
        output_component_file="component.yaml",
    )
