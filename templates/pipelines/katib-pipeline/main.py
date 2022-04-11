import os
from pathlib import Path
from typing import Union

from kfp.compiler import Compiler
from kfp.components import load_component_from_file as _load_component_from_file
from kfp.dsl import PipelineExecutionMode
from kfp.v2.dsl import pipeline


def load_component_from_file(path: Union[str, os.PathLike]):
    return _load_component_from_file(str(path))


comp_path = Path('../../components')
katib_solver_op = load_component_from_file(comp_path / 'katib-solver' / 'component.yaml')


@pipeline(name="katib-solver-pipeline")
def katib_solver_pipeline():
    katib_solver_op()


if __name__ == "__main__":
    Compiler(mode=PipelineExecutionMode.V2_COMPATIBLE).compile(
        katib_solver_pipeline, "pipeline.yaml")
