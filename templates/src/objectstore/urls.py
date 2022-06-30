def get_download_url(bucket: str, file_name: str, os4ml_namespace: str) -> str:
    base_server_url = _get_base_server_url(os4ml_namespace)
    return f"{base_server_url}/apis/v1beta1/objectstore/{bucket}/object?objectName={file_name}"


def get_databag_url(bucket: str, os4ml_namespace: str) -> str:
    base_server_url = _get_base_server_url(os4ml_namespace)
    return f"{base_server_url}/apis/v1beta1/objectstore/databag/{bucket}"


def put_databag_url(bucket: str, os4ml_namespace: str) -> str:
    base_server_url = _get_base_server_url(os4ml_namespace)
    return f"{base_server_url}/apis/v1beta1/objectstore/databag/{bucket}"


def _get_base_server_url(os4ml_namespace: str) -> str:
    return f"http://os4ml-objectstore-manager.{os4ml_namespace}.svc.cluster.local:8000"
