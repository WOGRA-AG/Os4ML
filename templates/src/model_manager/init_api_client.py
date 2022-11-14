from build.model_manager_client import ApiClient, Configuration
from build.model_manager_client.api.modelmanager_api import ModelmanagerApi
from config import OS4ML_NAMESPACE


def init_model_manager_client() -> ModelmanagerApi:
    default_config = Configuration.get_default_copy()
    url_arr = default_config.host.split(".")
    url_arr[1] = OS4ML_NAMESPACE
    default_config.host = ".".join(url_arr)
    api_client = ApiClient(configuration=default_config)
    return ModelmanagerApi(api_client=api_client)
