from kfp.v2.dsl import Input, Metrics, component


def upload_metrics(metrics: Input[Metrics]):
    import requests

    accuracy = metrics.metadata["accuracy"]
    # TODO update solution


if __name__ == "__main__":
    component(
        upload_metrics,
        base_image="python:3.10.2-slim",
        output_component_file="component.yaml",
    )
