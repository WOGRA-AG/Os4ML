import kfp
from kfp import Client
from src import ML_PIPELINE_URL


class KfpService:
    def __init__(self, host: str = ML_PIPELINE_URL, namespace: str = 'kubeflow', client=None):
        if client is None:
            client = self.init_client(host, namespace)
        self.client = client

    def init_client(self, host: str, namespace: str) -> Client:
        print("jup")
        return Client(host=host, namespace=namespace)

    def get_all_experiments(self):
        experiments = self.client.list_experiments(namespace='kubeflow-user-example-com')
        print(type(experiments))
        print(experiments)
