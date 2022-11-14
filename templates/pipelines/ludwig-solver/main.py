from kfp.v2.dsl import pipeline

from src.pipelines.util import compile_pipeline, load_component

load_databag_and_dataframe_op = load_component("load_databag_and_dataframe")
ludwig_solver_op = load_component("ludwig_solver")
get_metrics_op = load_component("get_metrics")


@pipeline(name="ludwig-solver")
def ludwig_solver_pipeline(
    databag_id: str,
    solution_name: str,
    batch_size: int = 8,
    epochs: int = 50,
    early_stop: int = 3,
    test_split: float = 0.1,
    validation_split: float = 0.1,
):
    databag_and_dataframe = load_databag_and_dataframe_op(
        databag_id=databag_id,
        solution_name=solution_name,
    )
    ludwig_solver = ludwig_solver_op(
        dataset_file=databag_and_dataframe.outputs["dataframe"],
        databag_file=databag_and_dataframe.outputs["databag"],
        solution_name=solution_name,
        batch_size=batch_size,
        epochs=epochs,
        early_stop=early_stop,
        test_split=test_split,
        validation_split=validation_split,
    )
    get_metrics_op(
        metrics=ludwig_solver.outputs["metrics"],
        solution_name=solution_name,
    )


def main():
    compile_pipeline(ludwig_solver_pipeline, file=__file__)


if __name__ == "__main__":
    main()
