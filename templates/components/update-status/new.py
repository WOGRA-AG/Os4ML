from kfp.v2.dsl import Artifact, component

from components.images import component_base_img


def update_status(
    status: str = "", depends_on: Artifact = None, solution_name: str = ""
):
    from src.components.update_status import update_status

    update_status(solution_name, status, solution_name=solution_name)


if __name__ == "__main__":
    component(
        update_status,
        base_image=component_base_img,
        output_component_file="component.yaml",
    )
