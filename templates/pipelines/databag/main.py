from kfp.v2.dsl import Condition, pipeline

from pipelines.build import compile_pipeline, load_component

get_file_type_op = load_component("get_file_type")
execute_dataframe_script_op = load_component("execute_dataframe_script")
create_dataframe_op = load_component("create_dataframe")


@pipeline(name="databag")
def databag(
    databag_id: str,
    solution_id: str,
    prediction_id: str,
    max_categories: int = 10,
):
    file_type = get_file_type_op(
        databag_id=databag_id,
    )

    with Condition(file_type.output == "script", name="script"):
        execute_dataframe_script_op(
            databag_id=databag_id,
            max_categories=max_categories,
        )

    with Condition(file_type.output != "script", name="no-script"):
        create_dataframe_op(
            file_type=file_type.output,
            databag_id=databag_id,
            max_categories=max_categories,
        )


def main():
    compile_pipeline(databag, pipeline_file=__file__)


if __name__ == "__main__":
    main()
