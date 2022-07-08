from components.images import python_image
from components.util import build_component
from kfp.v2.dsl import Dataset, Input


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


def main():
    build_component(
        upload_file_to_objectstore, base_image=python_image, file=__file__
    )


if __name__ == "__main__":
    main()
