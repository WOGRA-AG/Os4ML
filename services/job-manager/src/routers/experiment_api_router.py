from typing import List

from build.openapi_server.models.experiment import Experiment
from services.kfp_service import KfpService


class ExperimentApiRouter:
    @staticmethod
    def get_all_experiments() -> List[Experiment]:
        return KfpService().get_all_experiments()

    @staticmethod
    def post_experiment(experiment: Experiment) -> str:
        return KfpService().create_experiment(experiment)
