from kfp.v2.dsl import pipeline
from pipelines.util import StatusMessages, compile_pipeline, load_component

init_databag_op = load_component("init-databag")
get_databag_op = load_component("get-databag")
ludwig_solver_op = load_component("ludwig-solver")
get_metrics_op = load_component("get-metrics")
update_status_op = load_component("update-status")


@pipeline(name="ludwig-solver")
def ludwig_solver(
    bucket: str,
    file_name: str,
    solution_name: str = "",
    os4ml_namespace: str = "os4ml",
    epochs: int = 50,
):
    update_status_op(
        StatusMessages.created.value,
        solution_name=solution_name,
        os4ml_namespace=os4ml_namespace,
    )
    df_info = init_databag_op(
        file_name,
        bucket=bucket,
        solution_name=solution_name,
        os4ml_namespace=os4ml_namespace,
    )
    databag_file = get_databag_op(
        bucket, solution_name=solution_name, os4ml_namespace=os4ml_namespace
    )
    update_status_op(
        StatusMessages.running.value,
        df_info.outputs["dataset"],
        solution_name=solution_name,
        os4ml_namespace=os4ml_namespace,
    )
    ludwig_output = ludwig_solver_op(
        dataset_file=df_info.outputs["dataset"],
        databag_file=databag_file.output,
        epochs=epochs,
        solution_name=solution_name,
        os4ml_namespace=os4ml_namespace,
    )
    get_metrics_op(
        ludwig_output.outputs["metrics"],
        solution_name=solution_name,
        os4ml_namespace=os4ml_namespace,
    )
    update_status_op(
        StatusMessages.finished.value,
        ludwig_output.outputs["metrics"],
        solution_name=solution_name,
        os4ml_namespace=os4ml_namespace,
    )


if __name__ == "__main__":
    compile_pipeline(ludwig_solver)
