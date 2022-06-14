from kfp.v2.dsl import Input, Metrics, component

from components.images import component_base_img


def get_metrics(metrics: Input[Metrics], solution_name: str = ""):
    from src.components.get_metrics import get_metrics

    return get_metrics(metrics, solution_name=solution_name)


if __name__ == "__main__":
    component(
        get_metrics,
        base_image=component_base_img,
        output_component_file="component.yaml",
    )
