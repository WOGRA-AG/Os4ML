from components.images import python_image
from kfp.v2.dsl import Dataset, Input, component


def upload_file_to_objectstore(
    file: Input[Dataset], bucket: str, file_name: str
):
    import requests

    url = (
        f"http://objectstore-manager.os4ml:8000/apis/v1beta1"
        f"/objectstore/{bucket}/object"
    )
    with open(file.path, "rb") as payload:
        requests.put(url, data=payload, params={"object_name": file_name})


if __name__ == "__main__":
    component(
        upload_file_to_objectstore,
        base_image=python_image,
        output_component_file="component.yaml",
    )
