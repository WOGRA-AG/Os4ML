import enum
import pathlib
from typing import Callable

from kfp.compiler import Compiler
from kfp.components import load_component_from_file
from kfp.dsl import PipelineConf, PipelineExecutionMode
from kubernetes.client.models import V1LocalObjectReference


class StatusMessages(str, enum.Enum):
    created = "Solution created"
    running = "Solver running"
    finished = "Solver finished"


def load_component(component_dir: str):
    comp_path = pathlib.Path("../../components")
    comp_name = "component.yaml"
    component_file = comp_path / component_dir / comp_name
    return load_component_from_file(str(component_file))


def compile_pipeline(pipeline_func: Callable):
    credentials = V1LocalObjectReference("registry-credentials")
    conf = PipelineConf().set_image_pull_secrets([credentials])
    Compiler(mode=PipelineExecutionMode.V2_COMPATIBLE).compile(
        pipeline_func, "pipeline.yaml", pipeline_conf=conf
    )
