from kfp.v2.dsl import pipeline

from pipelines.util import compile_pipeline, load_component, DatabagStatusMessages

init_databag_op = load_component("init-databag")
sniffle_op = load_component("sniffle-dataset")
create_databag_op = load_component("create-databag")
update_databag_status_op = load_component("update-databag-status")


@pipeline(name="init-databag-sniffle-upload")
def init_databag_sniffle_upload(
    bucket: str = "os4ml",
    file_name: str = "titanic.xlsx",
    solution_name: str = "",
    max_categories: int = 10,
):
    update_databag_status_op(DatabagStatusMessages.uploading.value, bucket=bucket)
    df_info = init_databag_op(file_name, bucket=bucket)
    update_databag_status_op(DatabagStatusMessages.inspecting.value, depends_on=df_info.outputs["dataset"], bucket=bucket)
    sniffle = sniffle_op(
        dataset=df_info.outputs["dataset"],
        dataset_type=df_info.outputs["databag_type"],
        max_categories=max_categories,
        file_name=file_name,
        bucket=bucket,
    )
    update_databag_status_op(DatabagStatusMessages.creating.value, depends_on=sniffle.output, bucket=bucket)
    create_databag_op(sniffle.output, bucket)


if __name__ == "__main__":
    compile_pipeline(init_databag_sniffle_upload)
