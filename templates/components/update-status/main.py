from kfp.v2.dsl import Artifact, component


def update_status(
    solution_name: str = "", status: str = "", depends_on: Artifact = None
):
    import requests

    url = f"http://os4ml-jobmanager.os4ml:8000/apis/v1beta1/jobmanager/solution/{solution_name}"

    solution = requests.get(url).json()
    solution["status"] = status

    requests.put(url, json=solution)


if __name__ == "__main__":
    component(
        update_status,
        base_image="python:3.10.2-slim",
        output_component_file="component.yaml",
    )
