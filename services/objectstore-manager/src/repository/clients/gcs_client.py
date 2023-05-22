import time

from google.cloud.storage import Client
from icecream import ic

from lib.singleton import Singleton


def time_prefix() -> str:
    return f"ic | {time.strftime('%H:%M:%S')}"


ic.configureOutput(prefix=time_prefix)


class GcsClient(Client, metaclass=Singleton):
    pass


def get_gcs_client() -> Client:
    ic()
    client = Client()
    ic()
    return client
