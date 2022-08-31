from build.openapi_client import ApiClient, Configuration
from build.openapi_client.api.jobmanager_api import JobmanagerApi


def init_jobmanager_api() -> JobmanagerApi:
    default_config = Configuration.get_default_copy()
    default_config.host = "http://jobmanager:8000"
    api_client = ApiClient(configuration=default_config)
    return JobmanagerApi(api_client=api_client)
