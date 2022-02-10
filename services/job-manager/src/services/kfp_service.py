from kfp import Client
from kfp_server_api import ApiListExperimentsResponse

from src import ML_PIPELINE_URL


class KfpService:
    def __init__(self, host: str = ML_PIPELINE_URL, client=None):
        if client is None:
            client = self.init_client()
        self.client = client

    def init_client(self) -> Client:
        return Client()

    def get_all_experiments(self):
        experiments: ApiListExperimentsResponse = self.client.list_experiments(namespace='os4ml')
        print(experiments)
