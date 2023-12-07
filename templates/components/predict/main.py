from components.build import build_component
from components.images import ludwig_image


def predict(
    prediction_id: str,
):
    from components.predict import predict

    return predict(
        prediction_id=prediction_id,
    )


def main():
    build_component(
        predict,
        base_image=ludwig_image,
        file=__file__,
    )


if __name__ == "__main__":
    main()
