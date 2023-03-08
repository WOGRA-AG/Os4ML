from kfp.v2.dsl import pipeline

from pipelines.build import compile_pipeline, load_component

load_databag_and_dataframe_op = load_component("load_databag_and_dataframe")
ludwig_solver_op = load_component("ludwig_solver")
get_metrics_op = load_component("get_metrics")
create_prediction_template = load_component("create_prediction_template")


@pipeline(name="ludwig-solver")
def ludwig_solver_pipeline(
    databag_id: str,
    solution_id: str,
    prediction_id: str,
    batch_size: int = 8,
    epochs: int = 50,
    early_stop: int = 3,
    test_split: float = 0.1,
    validation_split: float = 0.1,
):
    databag_and_dataframe = load_databag_and_dataframe_op(
        solution_id=solution_id,
    )
    ludwig_solver = ludwig_solver_op(
        dataframe=databag_and_dataframe.outputs["dataframe"],
        databag=databag_and_dataframe.outputs["databag"],
        solution_id=solution_id,
        batch_size=batch_size,
        epochs=epochs,
        early_stop=early_stop,
        test_split=test_split,
        validation_split=validation_split,
    )
    create_prediction_template(
        dataframe=databag_and_dataframe.outputs["dataframe"],
        solution_id=solution_id,
    )
    get_metrics_op(
        metrics=ludwig_solver.outputs["metrics"],
        solution_id=solution_id,
    )


def main():
    compile_pipeline(ludwig_solver_pipeline, file=__file__)


if __name__ == "__main__":
    main()
