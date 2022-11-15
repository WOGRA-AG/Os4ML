from kfp.v2.dsl import Condition, pipeline

from pipelines.build import compile_pipeline, load_component

get_file_and_dataset_type_op = load_component("get_file_and_dataset_type")
execute_dataframe_script_op = load_component("execute_dataframe_script")
get_dataset_op = load_component("get_dataset")
create_dataframe_op = load_component("create_dataframe")
sniffle_op = load_component("sniffle_dataset")


@pipeline(name="databag")
def databag(
    databag_id: str,
    solution_name: str,
    max_categories: int = 10,
):
    types = get_file_and_dataset_type_op(
        databag_id=databag_id,
    )

    with Condition(types.outputs["file_type"] == "script", name="script"):
        dataframe = execute_dataframe_script_op(
            databag_id=databag_id,
        )

        sniffle_op(
            dataset=dataframe.output,
            dataset_type=types.outputs["dataset_type"],
            max_categories=max_categories,
            databag_id=databag_id,
        )

    with Condition(types.outputs["file_type"] != "script", name="no-script"):
        dataset = get_dataset_op(
            dataset_type=types.outputs["dataset_type"],
            databag_id=databag_id,
        )
        dataframe = create_dataframe_op(
            dataset=dataset.output,
            file_type=types.outputs["file_type"],
            databag_id=databag_id,
        )

        sniffle_op(
            dataset=dataframe.output,
            dataset_type=types.outputs["dataset_type"],
            max_categories=max_categories,
            databag_id=databag_id,
        )


def main():
    compile_pipeline(databag, file=__file__, node_pool="high-cpu")


if __name__ == "__main__":
    main()
