from kfp.v2.dsl import Input, Metrics

from components.build import build_component
from components.images import python_image


def get_metrics(metrics: Input[Metrics], solution_name: str):
    from components.get_metrics import get_metrics

    return get_metrics(
        metrics=metrics,
        solution_name=solution_name,
    )


def main():
    build_component(get_metrics, base_image=python_image, file=__file__)


if __name__ == "__main__":
    main()
