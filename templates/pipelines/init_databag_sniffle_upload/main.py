from kfp.dsl import RUN_ID_PLACEHOLDER
from kfp.v2.dsl import pipeline

from src.pipelines.util import compile_pipeline, load_component

init_empty_databag_op = load_component("init_empty_databag")
init_databag_op = load_component("init_databag")
sniffle_op = load_component("sniffle_dataset")


@pipeline(name="init-databag-sniffle-upload")
def init_databag_sniffle_upload(
    bucket: str = "os4ml",
    databag_id: str = "",
    file_name: str = "titanic.xlsx",
    solution_name: str = "",
    os4ml_namespace: str = "os4ml",
    max_categories: int = 10,
    run_id: str = RUN_ID_PLACEHOLDER,
):
    init_empty = init_empty_databag_op(
        file_name=file_name,
        run_id=run_id,
        bucket=bucket,
        databag_id=databag_id,
        os4ml_namespace=os4ml_namespace,
    )

    init_databag = init_databag_op(
        file_name=file_name,
        bucket=bucket,
        databag_id=databag_id,
        os4ml_namespace=os4ml_namespace,
        solution_name=solution_name,
        depends_on=init_empty.output,
    )

    sniffle_op(
        dataset=init_databag.outputs["dataset"],
        dataset_type=init_databag.outputs["databag_type"],
        max_categories=max_categories,
        databag_id=databag_id,
        os4ml_namespace=os4ml_namespace,
    )


def main():
    compile_pipeline(
        init_databag_sniffle_upload, file=__file__, node_pool="high-cpu"
    )


if __name__ == "__main__":
    main()
