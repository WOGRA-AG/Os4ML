from kfp.components import load_component_from_file
from kfp.compiler import Compiler
from kfp.dsl import PipelineExecutionMode

from kfp.v2.dsl import pipeline

comp_path = "../../components/"
download_dataset_from_objectstore_op = load_component_from_file(
    f"{comp_path}download-dataset-from-objectstore/component.yaml")
sniff_datatypes_op = load_component_from_file(
    f"{comp_path}sniff-datatypes/component.yaml")
upload_file_to_objectstore_op = load_component_from_file(
    f'{comp_path}upload_file_to_objectstore/component.yaml'
)


@pipeline(name="download-and-sniff-and-upload-pipeline")
def download_and_sniff_and_upload_pipeline(
        download_bucket: str = "os4ml",
        download_file_name: str = "titanic.xlsx",
        max_categories: int = 10,
        upload_bucket: str = "os4ml",
        upload_file_name: str = "settings.json"):
    download_task = download_dataset_from_objectstore_op(download_bucket,
                                                         download_file_name)
    sniff_task = sniff_datatypes_op(download_task.output,
                                    max_categories=max_categories)
    upload_file_to_objectstore_op(sniff_task.output,
                                  upload_bucket,
                                  upload_file_name)


if __name__ == "__main__":
    Compiler(mode=PipelineExecutionMode.V2_COMPATIBLE).compile(
        download_and_sniff_and_upload_pipeline, "pipeline.yaml")
