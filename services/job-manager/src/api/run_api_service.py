from typing import List

from build.openapi_server.models.create_run import CreateRun
from build.openapi_server.models.run import Run
from services.kfp_service import KfpService


class RunApiService:
    def __init__(self, kfp_service=None):
        self.kfp_service = kfp_service if kfp_service is not None else KfpService()

    def get_all_runs(self) -> List[Run]:
        return self.kfp_service.get_all_runs()

    def get_run(self, run_id: str) -> Run:
        return self.kfp_service.get_run(run_id)

    def post_run(self, experiment_id: str, pipeline_id: str, create_run: CreateRun) -> str:
        return self.kfp_service.create_run(experiment_id, pipeline_id, create_run)
