from typing import List

from build.openapi_server.models.experiment import Experiment
from services.kfp_service import KfpService


class ExperimentApiService:
    def __init__(self, kfp_service=None):
        self.kfp_service = kfp_service if kfp_service is not None else KfpService()

    def get_all_experiments(self) -> List[Experiment]:
        return self.kfp_service.get_all_experiments()

    def post_experiment(self, experiment: Experiment) -> str:
        return self.kfp_service.create_experiment(experiment)
