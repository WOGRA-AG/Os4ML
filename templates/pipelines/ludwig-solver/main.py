from kfp.compiler import Compiler
from kfp.dsl import PipelineConf, PipelineExecutionMode
from kfp.v2.dsl import pipeline
from kubernetes.client.models import V1LocalObjectReference

from pipelines.util import StatusMessages, load_component

init_databag_op = load_component("init-databag")
get_databag_op = load_component("get-databag")
ludwig_solver_op = load_component("ludwig-solver")
get_metrics_op = load_component("get-metrics")
update_status_op = load_component("update-status")


@pipeline(name="ludwig-solver")
def ludwig_solver(
    bucket: str, file_name: str, solution_name: str = "", epochs: int = 50
):
    update_status_op(solution_name, StatusMessages.created.value)
    df_info = init_databag_op(bucket, file_name)
    databag_file = get_databag_op(bucket)
    update_status_op(
        solution_name, StatusMessages.running.value, df_info.outputs["dataset"]
    )
    ludwig_output = ludwig_solver_op(
        dataset_file=df_info.outputs["dataset"],
        databag_file=databag_file.output,
        epochs=epochs,
    )
    get_metrics_op(ludwig_output.outputs["metrics"], solution_name)
    update_status_op(
        solution_name,
        StatusMessages.finished.value,
        ludwig_output.outputs["metrics"],
    )


if __name__ == "__main__":
    credentials = V1LocalObjectReference("registry-credentials")
    conf = PipelineConf().set_image_pull_secrets([credentials])
    Compiler(mode=PipelineExecutionMode.V2_COMPATIBLE).compile(
        ludwig_solver, "pipeline.yaml", pipeline_conf=conf
    )
