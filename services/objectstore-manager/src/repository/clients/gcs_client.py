from google.cloud.storage import Client

from lib.singleton import Singleton


class GcsClient(Client, metaclass=Singleton):
    pass


def get_gcs_client() -> Client:
    return Client()
