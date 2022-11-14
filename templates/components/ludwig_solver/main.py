from kfp.v2.dsl import ClassificationMetrics, Dataset, Input, Metrics, Output

from components.images import ludwig_image
from components.util import build_component


def ludwig_solver(
    dataset_file: Input[Dataset],
    databag_file: Input[Dataset],
    cls_metrics: Output[ClassificationMetrics],
    metrics: Output[Metrics],
    solution_name: str,
    batch_size: int = 8,
    epochs: int = 50,
    early_stop: int = 3,
    test_split: float = 0.1,
    validation_split: float = 0.1,
) -> None:
    from components.ludwig_solver import ludwig_solver

    ludwig_solver(
        dataset_file=dataset_file,
        databag_file=databag_file,
        cls_metrics=cls_metrics,
        metrics=metrics,
        solution_name=solution_name,
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
