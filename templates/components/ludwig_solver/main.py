from kfp.v2.dsl import Artifact, Dataset, Input

from components.build import build_component
from components.images import ludwig_image


def ludwig_solver(
    dataframe: Input[Dataset],
    databag: Input[Artifact],
    solution_id: str,
    batch_size: int = 8,
    epochs: int = 50,
    early_stop: int = 3,
    test_split: float = 0.1,
    validation_split: float = 0.1,
):
    from components.ludwig_solver import ludwig_solver

    ludwig_solver(
        dataframe=dataframe,
        databag=databag,
        solution_id=solution_id,
        batch_size=batch_size,
        epochs=epochs,
        early_stop=early_stop,
        test_split=test_split,
        validation_split=validation_split,
    )


def main():
    build_component(
        ludwig_solver,
        base_image=ludwig_image,
        file=__file__,
    )


if __name__ == "__main__":
    main()
