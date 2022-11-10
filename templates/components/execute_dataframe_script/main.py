from kfp.v2.dsl import Dataset, Output

from components.images import pandas_image
from components.build import build_component


def execute_dataframe_script(
    dataframe: Output[Dataset],
    databag_id: str,
):
    from components.execute_dataframe_script import execute_dataframe_script

    return execute_dataframe_script(
        dataframe=dataframe,
        databag_id=databag_id,
    )


def main():
    build_component(
        execute_dataframe_script, base_image=pandas_image, file=__file__
    )


if __name__ == "__main__":
    main()
