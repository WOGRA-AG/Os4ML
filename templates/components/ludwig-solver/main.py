from components.images import ludwig_image
from kfp.v2.dsl import (
    ClassificationMetrics,
    Dataset,
    Input,
    Metrics,
    Output,
    component,
)


def ludwig_solver(
    dataset_file: Input[Dataset],
    databag_file: Input[Dataset],
    cls_metrics: Output[ClassificationMetrics],
    metrics: Output[Metrics],
    batch_size: int = 8,
    epochs: int = 50,
    early_stop: int = 10,
    os4ml_namespace: str = "",
    solution_name: str = "",
) -> None:
    from src.components.ludwig_solver import ludwig_solver

    ludwig_solver(
        dataset_file,
        databag_file,
        cls_metrics,
        metrics,
        batch_size,
        epochs,
        early_stop,
        os4ml_namespace=os4ml_namespace,
        solution_name=solution_name,
    )


if __name__ == "__main__":
    component(
        ludwig_solver,
        base_image=ludwig_image,
        output_component_file="component.yaml",
    )
