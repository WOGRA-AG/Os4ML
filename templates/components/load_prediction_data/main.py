from kfp.v2.dsl import Dataset, Output

from components.build import build_component
from components.images import ludwig_image


def load_prediction_data(
    prediction_id: str,
    prediction_data: Output[Dataset],
):
    from components.load_prediction_data import load_prediction_data

    return load_prediction_data(
        prediction_id=prediction_id, prediction_data=prediction_data
    )


def main():
    build_component(
        load_prediction_data,
        base_image=ludwig_image,
        file=__file__,
    )


if __name__ == "__main__":
    main()
