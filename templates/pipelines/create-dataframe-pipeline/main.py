import os
from pathlib import Path

from kfp.compiler import Compiler
from kfp.components import load_component_from_file as _load_component_from_file
from kfp.dsl import PipelineExecutionMode
from kfp.v2.dsl import pipeline


def load_component_from_file(path: str | os.PathLike):
    return _load_component_from_file(str(path))


comp_path = Path('../../components')
create_dataframe_op = load_component_from_file(comp_path / 'create-dataframe' / 'component.yaml')


@pipeline(name="create-dataframe-pipeline")
def create_dataframe_pipeline(bucket: str, file_name: str):
    create_dataframe_op(bucket, file_name)


if __name__ == "__main__":
    Compiler(mode=PipelineExecutionMode.V2_COMPATIBLE).compile(
        create_dataframe_pipeline, "pipeline.yaml")
