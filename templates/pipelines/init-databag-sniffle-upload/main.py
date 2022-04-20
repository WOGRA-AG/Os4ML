from kfp.compiler import Compiler
from kfp.dsl import PipelineExecutionMode
from kfp.v2.dsl import pipeline

from templates.pipelines.util import load_component

init_databag_op = load_component('init-databag')
sniffle_op = load_component('sniffle-dataset')
upload_op = load_component('upload-to-objectstore')


@pipeline(name='init-databag-sniffle-upload')
def init_databag_sniffle_upload(
        bucket: str = 'os4ml',
        file_name: str = 'titanic.xlsx',
        max_categories: int = 10,
        upload_file_name: str = 'databag.json',
):
    df_info = init_databag_op(bucket, file_name)
    sniffle = sniffle_op(dataset=df_info.outputs['dataset'],
                         dataset_type=df_info.outputs['databag_type'],
                         max_categories=max_categories,
                         file_name=file_name,
                         bucket_name=bucket)
    upload_op(sniffle.output, bucket, upload_file_name)


if __name__ == '__main__':
    Compiler(mode=PipelineExecutionMode.V2_COMPATIBLE).compile(
        init_databag_sniffle_upload, 'pipeline.yaml')
