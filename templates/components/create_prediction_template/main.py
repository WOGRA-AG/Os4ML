from kfp.v2.dsl import Dataset, Input

from components.build import build_component
from components.images import pandas_image


def create_prediction_template(dataframe: Input[Dataset], solution_id: str):
    from components.create_prediction_template import (
        create_prediction_template,
    )

    return create_prediction_template(
        dataframe=dataframe, solution_id=solution_id
    )


def main():
    build_component(
        create_prediction_template, base_image=pandas_image, file=__file__
    )


if __name__ == "__main__":
    main()
