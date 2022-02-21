from kfp.components import load_component_from_file
from kfp.compiler import Compiler
from kfp.dsl import PipelineExecutionMode

from kfp.v2.dsl import pipeline

comp_path = "../../components/"
download_from_objectstore_op = load_component_from_file(
    f"{comp_path}/download-dataset-from-objectstore/component.yaml")
sniff_column_datatypes_op = load_component_from_file(
    f"{comp_path}/sniff-column-datatypes/component.yaml")


@pipeline(name="sniff-titanic-pipeline")
def sniff_titanic_pipeline(bucket: str = "os4ml",
                           file_name: str = "titanic.xlsx"):
    task = download_from_objectstore_op(bucket, file_name)
    sniff_task = sniff_column_datatypes_op(task.output)


if __name__ == "__main__":
    Compiler(mode=PipelineExecutionMode.V2_COMPATIBLE).compile(
        sniff_titanic_pipeline, "pipeline.yaml")
