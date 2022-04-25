from kfp.compiler import Compiler
from kfp.dsl import PipelineExecutionMode
from kfp.v2.dsl import pipeline

from templates.pipelines.util import load_component

init_databag_op = load_component('init-databag')
sniffle_op = load_component('sniffle-dataset')
create_databag_op = load_component('create-databag')


@pipeline(name='init-databag-sniffle-upload')
def init_databag_sniffle_upload(
        bucket: str = 'os4ml',
        file_name: str = 'titanic.xlsx',
        max_categories: int = 10,
):
    df_info = init_databag_op(bucket, file_name)
    sniffle = sniffle_op(dataset=df_info.outputs['dataset'],
                         dataset_type=df_info.outputs['databag_type'],
                         max_categories=max_categories,
                         file_name=file_name,
                         bucket_name=bucket)
    create_databag_op(sniffle.output, bucket)


if __name__ == '__main__':
    Compiler(mode=PipelineExecutionMode.V2_COMPATIBLE).compile(
        init_databag_sniffle_upload, 'pipeline.yaml')
