from build.objectstore import ApiClient, Configuration
from build.objectstore.api.objectstore_api import ObjectstoreApi


def init_objectstore_client(os4ml_namespace) -> ObjectstoreApi:
    default_config = Configuration.get_default_copy()
    url_arr = default_config.host.split(".")
    url_arr[1] = os4ml_namespace
    default_config.host = ".".join(url_arr)
    api_client = ApiClient(configuration=default_config)
    return ObjectstoreApi(api_client=api_client)
