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
    solution_name: str,
    os4ml_namespace: str,
    batch_size: int = 8,
    epochs: int = 50,
    early_stop: int = 3,
    test_split: float = 0.1,
    validation_split: float = 0.1,
):
    ...
#    init_databag = init_databag_op(
#        file_name=file_name,
#        bucket=bucket,
#        databag_id=databag_id,
#        solution_name=solution_name,
#        os4ml_namespace=os4ml_namespace,
#    )
#    get_databag = get_databag_op(
#        databag_id=databag_id,
#        solution_name=solution_name,
#        os4ml_namespace=os4ml_namespace,
#    )
#    ludwig_solver = ludwig_solver_op(
#        dataset_file=init_databag.outputs["dataset"],
#        databag_file=get_databag.output,
#        solution_name=solution_name,
#        os4ml_namespace=os4ml_namespace,
#        batch_size=batch_size,
#        epochs=epochs,
#        early_stop=early_stop,
#        test_split=test_split,
#        validation_split=validation_split,
#    )
#    get_metrics_op(
#        metrics=ludwig_solver.outputs["metrics"],
#        os4ml_namespace=os4ml_namespace,
#        solution_name=solution_name,
#    )


def main():
    compile_pipeline(ludwig_solver_pipeline, file=__file__)


if __name__ == "__main__":
    main()
