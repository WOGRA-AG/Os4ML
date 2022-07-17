from kfp.v2.dsl import pipeline
from pipelines.util import StatusMessages, compile_pipeline, load_component

init_databag_op = load_component("init_databag")
preprocess_data_op = load_component("preprocess_data")
train_random_forest_op = load_component("train_random_forest")
get_metrics_op = load_component("get_metrics")
update_status_op = load_component("update_status")


@pipeline(name="titanic-randomforest-pipeline")
def titanic_rf_pipeline(
    bucket: str = "os4ml",
    file_name: str = "titanic.xlsx",
    solution_name: str = "",
    os4ml_namespace: str = "os4ml",
):
    update_status_op(
        StatusMessages.created.value,
        solution_name=solution_name,
        os4ml_namespace=os4ml_namespace,
    )
    databag_info = init_databag_op(
        file_name=file_name, bucket=bucket, os4ml_namespace=os4ml_namespace, solution_name=solution_name
    )
    preprocess_task = preprocess_data_op(databag_info.outputs["dataset"])
    update_status_op(
        StatusMessages.running.value,
        databag_info.outputs["dataset"],
        solution_name=solution_name,
        os4ml_namespace=os4ml_namespace,
    )
    rf_output = train_random_forest_op(
        preprocess_task.outputs["x"], preprocess_task.outputs["y"]
    )
    get_metrics_op(
        rf_output.outputs["metrics"],
        solution_name=solution_name,
        os4ml_namespace=os4ml_namespace,
    )
    update_status_op(
        StatusMessages.finished.value,
        rf_output.outputs["metrics"],
        solution_name=solution_name,
        os4ml_namespace=os4ml_namespace,
    )


def main():
    compile_pipeline(titanic_rf_pipeline, file=__file__)


if __name__ == "__main__":
    main()
