from components.build import build_component
from components.images import pandas_image


def create_dataframe(
    file_type: str,
    databag_id: str,
    max_categories: int = 10,
):
    from components.create_dataframe import create_dataframe

    return create_dataframe(
        file_type=file_type,
        databag_id=databag_id,
        max_categories=max_categories,
    )


def main():
    build_component(create_dataframe, base_image=pandas_image, file=__file__)


if __name__ == "__main__":
    main()
