from kfp.components import load_component_from_file
from kfp.compiler import Compiler
from kfp.dsl import PipelineExecutionMode

from kfp.v2.dsl import pipeline

comp_path = "../../components/"
download_from_objectstore_op = load_component_from_file(f"{comp_path}/download-dataset-from-objectstore/component.yaml")
preprocess_data_op = load_component_from_file(f"{comp_path}/preprocess-data/component.yaml")
train_random_forest_op = load_component_from_file(f"{comp_path}/train-random-forest/component.yaml")


@pipeline(name="titanic-randomforest-pipeline")
def titanic_rf_pipeline(bucket: str = "os4ml", file_name: str = "titanic.xlsx"):
    task = download_from_objectstore_op(bucket, file_name)
    preprocess_task = preprocess_data_op(task.output)
    model_task = train_random_forest_op(preprocess_task.outputs["x"], preprocess_task.outputs["y"])


if __name__ == "__main__":
    Compiler(mode=PipelineExecutionMode.V2_COMPATIBLE).compile(titanic_rf_pipeline, "component.yaml")
