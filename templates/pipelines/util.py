import enum
import pathlib
from typing import Callable, Dict
import yaml

from kfp.compiler import Compiler
from kfp.components import load_component_from_file
from kfp.dsl import PipelineConf, PipelineExecutionMode
from kubernetes.client.models import V1LocalObjectReference

COMPONENT_PATH = pathlib.Path("../../components")
COMPONENT_FILE_NAME = "component.yaml"

PIPELINE_FILE_NAME = "pipeline.yaml"

OS4ML_PIPELINE_CONFIG_MAP = "os4ml-pipeline"


class StatusMessages(str, enum.Enum):
    created = "Solution created"
    running = "Solver running"
    finished = "Solver finished"


class DatabagStatusMessages(str, enum.Enum):
    uploading = "Uploading data"
    inspecting = "Inspecting datatypes of columns"
    creating = "Creating databag"


def load_component(component_dir: str):
    component_file = COMPONENT_PATH / component_dir / COMPONENT_FILE_NAME
    return load_component_from_file(str(component_file))


def build_pipeline_yaml(pipeline_func: Callable):
    _compile_pipeline(pipeline_func)
    pipeline_yaml = _load_pipeline_yaml()
    _add_config_map_envs_to_yaml(pipeline_yaml)
    _save_pipeline_yaml(pipeline_yaml)


def _compile_pipeline(pipeline_func: Callable):
    credentials = V1LocalObjectReference("registry-credentials")
    conf = PipelineConf().set_image_pull_secrets([credentials])
    Compiler(mode=PipelineExecutionMode.V2_COMPATIBLE).compile(
        pipeline_func, PIPELINE_FILE_NAME, pipeline_conf=conf
    )


def _load_pipeline_yaml() -> Dict:
    with open(PIPELINE_FILE_NAME) as pipeline:
        return yaml.load(pipeline)


def _save_pipeline_yaml(pipeline_yaml):
    with open(PIPELINE_FILE_NAME, 'w') as pipeline:
        yaml.dump(pipeline_yaml, pipeline)


def _add_config_map_envs_to_yaml(pipeline_yaml):
    templates = pipeline_yaml["spec"]["templates"]
    container_templates = (template for template in templates
                           if "container" in template)
    for container in container_templates:
        envs_from = container["container"]["envFrom"]
        envs_from.append({
            "configMapRef": {"name": OS4ML_PIPELINE_CONFIG_MAP, "optional": True}
        })
