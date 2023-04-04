from build.job_manager_client import ApiClient as JobmanagerApiClient
from build.job_manager_client import Configuration as JobmanagerConfiguration
from build.job_manager_client.api.jobmanager_api import JobmanagerApi
from build.objectstore_client import ApiClient as ObjectstoreApiClient
from build.objectstore_client import Configuration as ObjectstoreConfiguration
from build.objectstore_client.api.objectstore_api import ObjectstoreApi

from services import OS4ML_NAMESPACE


def init_objectstore_api() -> ObjectstoreApi:
    default_config = ObjectstoreConfiguration.get_default_copy()
    url_arr = default_config.host.split(".")
    if len(url_arr) <= 1:
        return ObjectstoreApi()
    url_arr[1] = OS4ML_NAMESPACE
    default_config.host = ".".join(url_arr)
    api_client = ObjectstoreApiClient(configuration=default_config)
    return ObjectstoreApi(api_client=api_client)


def init_jobmanager_api() -> JobmanagerApi:
    default_config = JobmanagerConfiguration.get_default_copy()
    url_arr = default_config.host.split(".")
    if len(url_arr) <= 1:
        return JobmanagerApi()
    url_arr[1] = OS4ML_NAMESPACE
    default_config.host = ".".join(url_arr)
    api_client = JobmanagerApiClient(configuration=default_config)
    return JobmanagerApi(api_client=api_client)
