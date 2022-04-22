from kfp.compiler import Compiler
from kfp.dsl import PipelineExecutionMode
from kfp.v2.dsl import pipeline

from templates.pipelines.util import load_component

init_databab_op = load_component('init-databag')
upload_op = load_component('upload-to-objectstore')
download_op = load_component('download-from-objectstore')
katib_solver_op = load_component('katib-solver')


@pipeline(name="katib-solver-pipeline")
def katib_solver_pipeline(bucket: str, file_name: str):
    df_info = init_databab_op(bucket, file_name)
    upload_op(df_info.outputs['dataset'], bucket, 'dataset')
    databag_info = download_op(bucket, 'databag.json')
    katib_solver_op(
        dataset_file=df_info.outputs['dataset'],
        databag_file=databag_info.output
    )


if __name__ == "__main__":
    Compiler(mode=PipelineExecutionMode.V2_COMPATIBLE).compile(
        katib_solver_pipeline, "pipeline.yaml")
