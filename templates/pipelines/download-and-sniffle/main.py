from kfp.components import load_component_from_file
from kfp.compiler import Compiler
from kfp.dsl import PipelineExecutionMode

from kfp.v2.dsl import pipeline

comp_path = "../../components/"
download_from_objectstore_op = load_component_from_file(
    f"{comp_path}download-dataset-from-objectstore/component.yaml")
sniffle_dataset_op = load_component_from_file(
    f"{comp_path}sniffle-dataset/component.yaml")


@pipeline(name="download-and-sniffle-pipeline")
def download_and_sniffle_pipeline(bucket: str = "os4ml",
                                  file_name: str = "titanic.xlsx",
                                  max_categories: int = 10):
    task = download_from_objectstore_op(bucket, file_name)
    sniffle_dataset_op(task.output, max_categories=max_categories)


if __name__ == "__main__":
    Compiler(mode=PipelineExecutionMode.V2_COMPATIBLE).compile(
        download_and_sniffle_pipeline, "component.yaml")
