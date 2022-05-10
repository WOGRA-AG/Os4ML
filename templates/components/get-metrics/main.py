from kfp.v2.dsl import Input, Metrics, component


def get_metrics(metrics: Input[Metrics], solution_name: str = ""):
    import requests
    from datetime import datetime

    if "accuracy" in metrics.metadata:
        accuracy = metrics.metadata["accuracy"]
        url = f"http://os4ml-jobmanager.os4ml:8000/apis/v1beta1/jobmanager/solution/{solution_name}"

        solution = requests.get(url).json()
        if "metrics" not in solution or solution["metrics"] is None:
            solution["metrics"] = dict()
        solution["metrics"]["accuracy"] = accuracy
        solution["completionTime"] = datetime.utcnow().strftime('%Y-%m-%dT%H:%M:%SZ')

        requests.put(url, json=solution)


if __name__ == "__main__":
    component(
        get_metrics,
        base_image="python:3.10.2-slim",
        output_component_file="component.yaml",
    )
