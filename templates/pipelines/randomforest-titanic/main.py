from kfp.compiler import Compiler
from kfp.dsl import PipelineExecutionMode
from kfp.v2.dsl import pipeline

from pipelines.util import load_component

init_databag_op = load_component("init-databag")
preprocess_data_op = load_component("preprocess-data")
train_random_forest_op = load_component("train-random-forest")


@pipeline(name="titanic-randomforest-pipeline")
def titanic_rf_pipeline(
        bucket: str = "os4ml", file_name: str = "titanic.xlsx", solution_name: str = ""
):
    databag_info = init_databag_op(bucket, file_name)
    preprocess_task = preprocess_data_op(databag_info.outputs["dataset"])
    train_random_forest_op(
        preprocess_task.outputs["x"], preprocess_task.outputs["y"]
    )


if __name__ == "__main__":
    Compiler(mode=PipelineExecutionMode.V2_COMPATIBLE).compile(
        titanic_rf_pipeline, "pipeline.yaml"
    )
