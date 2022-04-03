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
sniffle_op = load_component_from_file(comp_path / 'sniffle-dataset' / 'component.yaml')


@pipeline(name="create-dataframe-pipeline")
def create_dataframe_pipeline(bucket: str, file_name: str):
    df_info = create_dataframe_op(bucket, file_name)
    sniffle_op(dataframe=df_info.outputs['dataframe'],
               dataset_type=df_info.outputs['databag_type'],
               file_name=file_name,
               bucket_name=bucket)


if __name__ == "__main__":
    Compiler(mode=PipelineExecutionMode.V2_COMPATIBLE).compile(
        create_dataframe_pipeline, "pipeline.yaml")
