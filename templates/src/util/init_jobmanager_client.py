from build.jobmanager import ApiClient, Configuration
from build.jobmanager.api.jobmanager_api import JobmanagerApi


def init_jobmanager_client(os4ml_namespace) -> JobmanagerApi:
    default_config = Configuration.get_default_copy()
    url_arr = default_config.host.split(".")
    url_arr[1] = os4ml_namespace
    default_config.host = ".".join(url_arr)
    api_client = ApiClient(configuration=default_config)
    return JobmanagerApi(api_client=api_client)
