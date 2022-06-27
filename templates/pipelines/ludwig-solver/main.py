from kfp.v2.dsl import pipeline

from pipelines.util import StatusMessages, load_component, build_pipeline_yaml

init_databag_op = load_component("init-databag")
get_databag_op = load_component("get-databag")
ludwig_solver_op = load_component("ludwig-solver")
get_metrics_op = load_component("get-metrics")
update_status_op = load_component("update-status")


@pipeline(name="ludwig-solver")
def ludwig_solver(
    bucket: str, file_name: str, solution_name: str = "", epochs: int = 50
):
    update_status_op(StatusMessages.created.value, solution_name=solution_name)
    df_info = init_databag_op(file_name, bucket=bucket, solution_name=solution_name)
    databag_file = get_databag_op(bucket, solution_name=solution_name)
    update_status_op(
        StatusMessages.running.value,
        df_info.outputs["dataset"],
        solution_name=solution_name,
    )
    ludwig_output = ludwig_solver_op(
        dataset_file=df_info.outputs["dataset"],
        databag_file=databag_file.output,
        epochs=epochs,
        solution_name=solution_name,
    )
    get_metrics_op(
        ludwig_output.outputs["metrics"], solution_name=solution_name
    )
    update_status_op(
        StatusMessages.finished.value,
        ludwig_output.outputs["metrics"],
        solution_name=solution_name,
    )


if __name__ == "__main__":
    build_pipeline_yaml(ludwig_solver)
