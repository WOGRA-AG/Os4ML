from kfp.v2.dsl import Dataset, Input, component


def create_databag(file: Input[Dataset], bucket: str):
    import json

    import requests

    url = (
        f"http://os4ml-objectstore-manager.os4ml:8000/apis/v1beta1"
        f"/objectstore/databag/{bucket}"
    )
    with open(file.path) as json_file:
        json_data = json.load(json_file)
        print(json_data)
        requests.put(url, json=json_data)


if __name__ == "__main__":
    component(
        create_databag,
        base_image="python:3.10.2-slim",
        output_component_file="component.yaml",
    )
