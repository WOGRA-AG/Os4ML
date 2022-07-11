import pathlib

from kfp.v2.dsl import component

COMPONENT_FILE_NAME = "component.yaml"


def build_component(
    component_func, base_image, file, packages_to_install=None
):
    component_file = pathlib.Path(file).parent / COMPONENT_FILE_NAME
    component(
        component_func,
        base_image=base_image,
        output_component_file=str(component_file),
        packages_to_install=packages_to_install,
    )
