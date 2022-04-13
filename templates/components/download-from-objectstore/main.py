from kfp.v2.dsl import component, Dataset

def download_from_objectstore(bucket: str, file_name: str) -> Dataset:
    import requests
    url = f'http://os4ml-objectstore-manager.os4ml:8000/apis/v1beta1/objectstore/{bucket}/object/{file_name}'
    response = requests.get(url)
    return response.text


if __name__ == "__main__":
    component(download_from_objectstore, base_image="python:3.10.2-slim",
              output_component_file="component.yaml")
