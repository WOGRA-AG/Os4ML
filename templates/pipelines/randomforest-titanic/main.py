from kfp.compiler import Compiler
from kfp.dsl import PipelineExecutionMode
from kfp.v2.dsl import pipeline

from pipelines.util import StatusMessages, load_component

init_databag_op = load_component("init-databag")
preprocess_data_op = load_component("preprocess-data")
train_random_forest_op = load_component("train-random-forest")
get_metrics_op = load_component("get-metrics")
update_status_op = load_component("update-status")


@pipeline(name="titanic-randomforest-pipeline")
def titanic_rf_pipeline(
    bucket: str = "os4ml",
    file_name: str = "titanic.xlsx",
    solution_name: str = "",
):
    update_status_op(solution_name, StatusMessages.created.value)
    databag_info = init_databag_op(bucket, file_name)
    preprocess_task = preprocess_data_op(databag_info.outputs["dataset"])
    update_status_op(
        solution_name, StatusMessages.running.value, databag_info.outputs["dataset"]
    )
    rf_output = train_random_forest_op(
        preprocess_task.outputs["x"], preprocess_task.outputs["y"]
    )
    get_metrics_op(rf_output.outputs["metrics"], solution_name)
    update_status_op(
        solution_name,
        StatusMessages.finished.value,
        rf_output.outputs["metrics"],
    )


if __name__ == "__main__":
    Compiler(mode=PipelineExecutionMode.V2_COMPATIBLE).compile(
        titanic_rf_pipeline, "pipeline.yaml"
    )
