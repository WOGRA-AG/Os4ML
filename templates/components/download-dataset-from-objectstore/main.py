from kfp.v2.dsl import component, Dataset


def download_from_objectstore(bucket: str, file_name: str) -> Dataset:
    import pandas as pd
    data_uri: str = f'http://os4ml-objectstore-manager.os4ml:8000/apis/v1beta1/objectstore/{bucket}/object/{file_name}'
    return pd.read_excel(data_uri, sheet_name='train').to_csv(index=False)


if __name__ == "__main__":
    component(download_from_objectstore, base_image="python:3.9.10-slim",
              output_component_file="component.yaml",
              packages_to_install=["pandas>=1.4.0", "xlrd>=2.0.1",
                                   "openpyxl>=3.0.9"])
