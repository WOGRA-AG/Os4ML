from kfp.components import load_component_from_file
from kfp.compiler import Compiler
from kfp.dsl import PipelineExecutionMode

from kfp.v2.dsl import pipeline

comp_path = "../../components/"
download_from_objectstore_op = load_component_from_file(
    f"{comp_path}download-dataset-from-objectstore/component.yaml")
sniffle_dataset_op = load_component_from_file(
    f"{comp_path}sniffle-dataset/component.yaml")
ludwig_solver_op = load_component_from_file(
    f"{comp_path}ludwig_solver/component.yaml"
)


@pipeline(name="download-and-ludwig-solver")
def download_and_sniffle_pipeline(bucket: str = "os4ml",
                                  file_name: str = "titanic.xlsx",
                                  max_categories: int = 10,
                                  epochs: int = 50):
    dataset = download_from_objectstore_op(bucket, file_name)
    settings = sniffle_dataset_op(dataset.output,
                                  max_categories=max_categories)
    ludwig_solver_op(dataset.output, settings.output, epochs=epochs)


if __name__ == "__main__":
    Compiler(mode=PipelineExecutionMode.V2_COMPATIBLE).compile(
        download_and_sniffle_pipeline, "pipeline.yaml")
