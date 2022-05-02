from kfp.v2.dsl import Artifact, Metrics, Output, component


def mock_metric(
    metrics: Output[Metrics],
):
    metrics.log_metric("accuracy", 0.9999999999)
    print(metrics.path)
    print(metrics.uri)


if __name__ == "__main__":
    component(
        mock_metric,
        base_image="python:3.10.2-slim",
        output_component_file="component.yaml",
    )
