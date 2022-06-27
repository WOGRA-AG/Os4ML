from build.openapi_client import ApiClient, Configuration
from build.openapi_client.api.objectstore_api import ObjectstoreApi
from services import OS4ML_NAMESPACE


def init_objectstore_api() -> ObjectstoreApi:
    default_config = Configuration.get_default_copy()
    url_arr = default_config.host.split(".")
    url_arr[1] = OS4ML_NAMESPACE
    default_config.host = ".".join(url_arr)
    api_client = ApiClient(configuration=default_config)
    return ObjectstoreApi(api_client=api_client)
