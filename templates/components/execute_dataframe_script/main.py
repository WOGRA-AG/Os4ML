from components.build import build_component
from components.images import pandas_image


def execute_dataframe_script(
    databag_id: str,
    max_categories: int = 10,
):
    from components.execute_dataframe_script import execute_dataframe_script

    return execute_dataframe_script(
        databag_id=databag_id,
        max_categories=max_categories,
    )


def main():
    build_component(
        execute_dataframe_script, base_image=pandas_image, file=__file__
    )


if __name__ == "__main__":
    main()
