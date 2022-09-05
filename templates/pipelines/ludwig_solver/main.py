from kfp.v2.dsl import pipeline

from src.pipelines.util import compile_pipeline, load_component

init_databag_op = load_component("init_databag")
get_databag_op = load_component("get_databag")
ludwig_solver_op = load_component("ludwig_solver")
get_metrics_op = load_component("get_metrics")


@pipeline(name="ludwig-solver")
def ludwig_solver_pipeline(
    bucket: str,
    databag_id: str,
    file_name: str,
    solution_name: str = "",
    os4ml_namespace: str = "os4ml",
    epochs: int = 50,
):
    init_databag = init_databag_op(
        file_name,
        bucket=bucket,
        databag_id=databag_id,
        solution_name=solution_name,
        os4ml_namespace=os4ml_namespace,
    )
    get_databag = get_databag_op(
        databag_id=databag_id,
        solution_name=solution_name,
        os4ml_namespace=os4ml_namespace,
    )
    ludwig_solver = ludwig_solver_op(
        dataset_file=init_databag.outputs["dataset"],
        databag_file=get_databag.output,
        epochs=epochs,
        solution_name=solution_name,
        os4ml_namespace=os4ml_namespace,
    )
    get_metrics_op(
        ludwig_solver.outputs["metrics"],
        solution_name=solution_name,
        os4ml_namespace=os4ml_namespace,
    )


def main():
    compile_pipeline(ludwig_solver_pipeline, file=__file__)


if __name__ == "__main__":
    main()
