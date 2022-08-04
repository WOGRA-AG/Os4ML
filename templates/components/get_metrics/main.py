from kfp.v2.dsl import Input, Metrics

from components.images import python_image
from components.util import build_component


def get_metrics(
    metrics: Input[Metrics], os4ml_namespace: str, solution_name: str
):
    from components.get_metrics import get_metrics

    return get_metrics(
        metrics, os4ml_namespace=os4ml_namespace, solution_name=solution_name
    )


def main():
    build_component(get_metrics, base_image=python_image, file=__file__)


if __name__ == "__main__":
    main()
