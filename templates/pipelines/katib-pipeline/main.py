from kfp.compiler import Compiler
from kfp.dsl import PipelineExecutionMode
from kfp.v2.dsl import pipeline

from templates.pipelines.util import load_component

init_databab_op = load_component('init-databag')
upload_op = load_component('upload-to-objectstore')
get_databag_op = load_component('get-databag')
katib_solver_op = load_component('katib-solver')


@pipeline(name="katib-solver-pipeline")
def katib_solver_pipeline(bucket: str, file_name: str, dataset_file_name: str = 'dataset'):
    df_info = init_databab_op(bucket, file_name)
    upload_op(df_info.outputs['dataset'], bucket, dataset_file_name)
    databag = get_databag_op(bucket)
    katib_solver_op(
        databag_file=databag.output,
        dataset_file_name=dataset_file_name,
        parallel_trial_count=1,
        max_trial_count=5,
    )


if __name__ == "__main__":
    Compiler(mode=PipelineExecutionMode.V2_COMPATIBLE).compile(
        katib_solver_pipeline, "pipeline.yaml")
