from kfp.v2.dsl import Dataset, Input, component

from components.images import component_base_img


def create_databag(file: Input[Dataset], bucket: str, solution_name: str = ""):
    from src.components.create_databag import create_databag

    return create_databag(file, bucket, solution_name=solution_name)


if __name__ == "__main__":
    component(
        create_databag,
        base_image=component_base_img,
        output_component_file="component.yaml",
    )
