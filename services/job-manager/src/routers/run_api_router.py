from typing import List

from build.openapi_server.models.create_run import CreateRun
from build.openapi_server.models.run import Run
from services.kfp_service import KfpService


class RunApiRouter:
    @staticmethod
    def get_all_runs() -> List[Run]:
        return KfpService().get_all_runs()

    @staticmethod
    def get_run(run_id: str) -> Run:
        return KfpService().get_run(run_id)

    @staticmethod
    def post_run(experiment_id: str, pipeline_id: str, create_run: CreateRun) -> str:
        return KfpService().create_run(experiment_id, pipeline_id, create_run)
