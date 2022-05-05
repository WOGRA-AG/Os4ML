import pathlib

from kfp.components import load_component_from_file

comp_path = pathlib.Path("../../components")
comp_name = "component.yaml"


def load_component(component_dir: str):
    component_file = comp_path / component_dir / comp_name
    return load_component_from_file(str(component_file))
