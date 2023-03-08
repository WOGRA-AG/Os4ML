from kfp.v2.dsl import Artifact, Output

from components.build import build_component
from components.images import ludwig_image


def load_model(prediction_id: str, model: Output[Artifact]):
    from components.load_model import load_model

    return load_model(prediction_id=prediction_id, model=model)


def main():
    build_component(
        load_model,
        base_image=ludwig_image,
        file=__file__,
    )


if __name__ == "__main__":
    main()
