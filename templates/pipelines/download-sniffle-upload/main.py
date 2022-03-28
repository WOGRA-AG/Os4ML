from kfp.components import load_component_from_file
from kfp.compiler import Compiler
from kfp.dsl import PipelineExecutionMode

from kfp.v2.dsl import pipeline

comp_path = "../../components/"
download_dataset_from_objectstore_op = load_component_from_file(
    f"{comp_path}download-dataset-from-objectstore/component.yaml")
sniffle_dataset_op = load_component_from_file(
    f"{comp_path}sniffle-dataset/component.yaml")
upload_file_to_objectstore_op = load_component_from_file(
    f'{comp_path}upload_file_to_objectstore/component.yaml'
)


@pipeline(name="download-sniffle-upload")
def download_sniffle_upload(
        bucket: str = "os4ml",
        file_name: str = "titanic.xlsx",
        max_categories: int = 10,
        upload_file_name: str = "databag.json"):
    download_task = download_dataset_from_objectstore_op(bucket,
                                                         file_name)
    sniff_task = sniffle_dataset_op(download_task.output,
                                    max_categories=max_categories,
                                    file_name=file_name,
                                    bucket_name=bucket)
    upload_file_to_objectstore_op(sniff_task.output,
                                  bucket,
                                  upload_file_name)


if __name__ == "__main__":
    Compiler(mode=PipelineExecutionMode.V2_COMPATIBLE).compile(
        download_sniffle_upload, "component.yaml")
