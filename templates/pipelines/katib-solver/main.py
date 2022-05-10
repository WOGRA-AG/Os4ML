from kfp.compiler import Compiler
from kfp.dsl import PipelineExecutionMode
from kfp.v2.dsl import pipeline

from pipelines.util import load_component

init_databab_op = load_component("init-databag")
upload_op = load_component("upload-to-objectstore")
get_databag_op = load_component("get-databag")
katib_solver_op = load_component("katib-solver")
get_metrics_op = load_component("get-metrics")


@pipeline(name="katib-solver")
def katib_solver(
    bucket: str,
    file_name: str,
    solution_name: str = "",
    dataset_file_name: str = "dataset",
):
    df_info = init_databab_op(bucket, file_name)
    upload_op(df_info.outputs["dataset"], bucket, dataset_file_name)
    databag = get_databag_op(bucket)
    katib_output = katib_solver_op(
        databag_file=databag.output,
        dataset_file_name=dataset_file_name,
        parallel_trial_count=1,
        max_trial_count=5,
    )
    get_metrics_op(katib_output.outputs["metrics"], solution_name)


if __name__ == "__main__":
    Compiler(mode=PipelineExecutionMode.V2_COMPATIBLE).compile(
        katib_solver, "pipeline.yaml"
    )
