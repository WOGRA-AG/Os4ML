from kfp.v2.dsl import component, Dataset, Input


def upload_file_to_objectstore(file: Input[Dataset],
                               bucket: str,
                               file_name: str):
    import requests
    url = f'http://os4ml-objectstore-manager.os4ml:8000/apis/v1beta1' \
          f'/objectstore/{bucket}/object/{file_name}'
    with open(file.path, 'rb') as payload:
        response = requests.put(url, data=payload)
    assert response.status_code == 200


if __name__ == '__main__':
    component(upload_file_to_objectstore, base_image='python:3.10.2-slim',
              output_component_file='component.yaml')
