from kfp.dsl import RUN_ID_PLACEHOLDER
from kfp.v2.dsl import Condition, pipeline

from src.pipelines.util import compile_pipeline, load_component

init_empty_databag_op = load_component("init_empty_databag")

create_dataframe_op = load_component("create_dataframe")
execute_dataframe_script_op = load_component("execute_dataframe_script")
get_dataset_op = load_component("get_dataset")
get_file_and_dataset_type_op = load_component("get_file_and_dataset_type")

sniffle_op = load_component("sniffle_dataset")


@pipeline(name="databag")
def databag(
    bucket: str,
    databag_id: str,
    file_name: str,
    solution_name: str,
    os4ml_namespace: str,
    max_categories: int = 10,
    run_id: str = RUN_ID_PLACEHOLDER,
):
    init_empty_databag_op(
        file_name=file_name,
        run_id=run_id,
        bucket=bucket,
        databag_id=databag_id,
        os4ml_namespace=os4ml_namespace,
    )

    types = get_file_and_dataset_type_op(
        file_name=file_name,
        databag_id=databag_id,
        os4ml_namespace=os4ml_namespace,
    )

    with Condition(types.outputs["file_type"] == "script", name="script"):
        dataframe = execute_dataframe_script_op(
            bucket=bucket,
            file_name=file_name,
            databag_id=databag_id,
            os4ml_namespace=os4ml_namespace,
        )

        sniffle_op(
            dataset=dataframe.output,
            dataset_type=types.outputs["dataset_type"],
            max_categories=max_categories,
            databag_id=databag_id,
            os4ml_namespace=os4ml_namespace,
        )

    with Condition(types.outputs["file_type"] != "script", name="no-script"):
        dataset = get_dataset_op(
            dataset_type=types.outputs["dataset_type"],
            file_name=file_name,
            bucket=bucket,
            databag_id=databag_id,
            os4ml_namespace=os4ml_namespace,
        )
        dataframe = create_dataframe_op(
            dataset=dataset.output,
            file_type=types.outputs["file_type"],
            databag_id=databag_id,
            os4ml_namespace=os4ml_namespace,
        )

        sniffle_op(
            dataset=dataframe.output,
            dataset_type=types.outputs["dataset_type"],
            max_categories=max_categories,
            databag_id=databag_id,
            os4ml_namespace=os4ml_namespace,
        )


def main():
    compile_pipeline(databag, file=__file__, node_pool="high-cpu")


if __name__ == "__main__":
    main()
