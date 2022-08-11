import enum
import pathlib
from typing import Callable

from kfp.compiler import Compiler
from kfp.components import load_component_from_file
from kfp.dsl import PipelineConf, PipelineExecutionMode
from kubernetes.client.models import V1LocalObjectReference

PIPELINE_FILE_NAME = "pipeline.yaml"


class StatusMessages(str, enum.Enum):
    created = "Solution created"
    running = "Solver running"
    finished = "Solver finished"


class DatabagStatusMessages(str, enum.Enum):
    uploading = "Uploading data"
    inspecting = "Inspecting datatypes of columns"
    creating = "Creating databag"


def load_component(component_dir: str):
    comp_path = pathlib.Path("components")
    comp_name = "component.yaml"
    component_file = comp_path / component_dir / comp_name
    return load_component_from_file(str(component_file))


def compile_pipeline(pipeline_func: Callable, file: str):
    pipeline_name = pathlib.Path(file).parent / PIPELINE_FILE_NAME
    credentials = V1LocalObjectReference("registry-credentials")
    conf = PipelineConf().set_image_pull_secrets([credentials])
    conf = conf.set_image_pull_policy("Always")
    Compiler(mode=PipelineExecutionMode.V2_COMPATIBLE).compile(
        pipeline_func, str(pipeline_name), pipeline_conf=conf
    )
