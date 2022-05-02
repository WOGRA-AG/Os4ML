from kfp.v2.dsl import Dataset, component


def get_databag(bucket: str) -> Dataset:
    import json

    def camel_to_snake(camel: str):
        """Converts a camelCase str to a snake_case str."""
        return "".join("_" + c.lower() if c.isupper() else c for c in camel)

    import requests

    url = f"http://os4ml-objectstore-manager.os4ml:8000/apis/v1beta1/objectstore/databag/{bucket}"
    response = requests.get(url)
    databag = response.json()
    return json.dumps(
        {camel_to_snake(key): value for key, value in databag.items()}
    )


if __name__ == "__main__":
    component(
        get_databag,
        base_image="python:3.10.2-slim",
        output_component_file="component.yaml",
    )
