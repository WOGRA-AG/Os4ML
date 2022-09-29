from kfp.v2.dsl import Dataset, Output

from components.images import pandas_image
from components.util import build_component


def execute_dataframe_script(
    dataframe: Output[Dataset],
    bucket: str,
    file_name: str,
    databag_id: str,
    os4ml_namespace: str,
):
    from components.execute_dataframe_script import execute_dataframe_script

    return execute_dataframe_script(
        dataframe=dataframe,
        bucket=bucket,
        file_name=file_name,
        databag_id=databag_id,
        os4ml_namespace=os4ml_namespace,
    )


def main():
    build_component(
        execute_dataframe_script, base_image=pandas_image, file=__file__
    )


if __name__ == "__main__":
    main()
