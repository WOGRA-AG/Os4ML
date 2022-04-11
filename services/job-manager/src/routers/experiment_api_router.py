from typing import List

from fastapi import APIRouter, Body

from build.openapi_server.models.experiment import Experiment

from services.kfp_service import KfpService

router = APIRouter(prefix="/apis/v1beta1")


class ExperimentApiRouter:

    @staticmethod
    def get_all_experiments() -> List[Experiment]:
        return KfpService().get_all_experiments()

    @staticmethod
    def post_experiment(
            experiment: Experiment = Body(..., description="")) -> str:
        return KfpService().create_experiment(experiment)
