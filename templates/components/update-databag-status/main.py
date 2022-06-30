from components.images import python_image
from kfp.v2.dsl import Artifact, component


def update_databag_status(
    status: str = "", depends_on: Artifact = None, bucket: str = ""
):
    from src.components.update_databag_status import update_databag_status

    update_databag_status(status, bucket=bucket)


if __name__ == "__main__":
    component(
        update_databag_status,
        base_image=python_image,
        output_component_file="component.yaml",
    )
