from kfp.compiler import Compiler
from kfp.dsl import PipelineExecutionMode
from kfp.v2.dsl import pipeline

from templates.pipelines.util import load_component

init_databag_op = load_component('init-databag')
download_op = load_component('download-from-objectstore')
ludwig_solver_op = load_component('ludwig-solver')


@pipeline(name="create-dataframe-pipeline")
def create_dataframe_pipeline(bucket: str,
                              file_name: str,
                              epochs: int = 50):
    df_info = init_databag_op(bucket, file_name)
    databag_file = download_op(bucket, 'databag.json')
    ludwig_solver_op(
        dataset_file=df_info.outputs['dataset'],
        databag_file=databag_file.output,
        epochs=epochs,
    )


if __name__ == "__main__":
    Compiler(mode=PipelineExecutionMode.V2_COMPATIBLE).compile(
        create_dataframe_pipeline, "pipeline.yaml")
