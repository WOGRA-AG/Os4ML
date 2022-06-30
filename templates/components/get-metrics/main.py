from components.images import python_image
from kfp.v2.dsl import Input, Metrics, component


def get_metrics(
    metrics: Input[Metrics], os4ml_namespace: str, solution_name: str
):
    from src.components.get_metrics import get_metrics

    return get_metrics(
        metrics, os4ml_namespace=os4ml_namespace, solution_name=solution_name
    )


if __name__ == "__main__":
    component(
        get_metrics,
        base_image=python_image,
        output_component_file="component.yaml",
    )
