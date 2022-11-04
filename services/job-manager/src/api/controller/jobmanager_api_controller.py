from typing import List

from fastapi import Depends

from build.openapi_server.models.create_pipeline import CreatePipeline
from build.openapi_server.models.create_run import CreateRun
from build.openapi_server.models.pipeline import Pipeline
from build.openapi_server.models.run import Run
from build.openapi_server.models.run_params import RunParams
from build.openapi_server.models.user import User
from executor.kfp_executor import KfpExecutor
from services.auth_service import get_parsed_token
from services.template_service import TemplateService


class JobmanagerApiController:
    def __init__(
        self,
        kfp_service: KfpExecutor = Depends(),
        template_service: TemplateService = Depends(),
        user: User = Depends(get_parsed_token),
    ):
        self.kfp_service = kfp_service
        self.template_service = template_service
        self.user = user

    def create_pipeline(
        self, create_pipeline: CreatePipeline, usertoken: str = ""
    ) -> str:
        return self.kfp_service.create_pipeline(create_pipeline)

    def create_run(
        self,
        experiment_id: str,
        pipeline_id: str,
        create_run: CreateRun,
        usertoken: str = "",
    ) -> str:
        return self.kfp_service.create_run(
            experiment_id, pipeline_id, create_run
        )

    def delete_run_by_id(self, run_id: str, usertoken: str = "") -> None:
        return self.kfp_service.delete_run(run_id)

    def get_pipelines(self, usertoken: str = "") -> List[Pipeline]:
        return self.kfp_service.get_all_pipelines()

    def get_run_by_id(self, run_id: str, usertoken: str = "") -> Run:
        return self.kfp_service.get_run(run_id)

    def get_runs(self, usertoken: str = "") -> List[Run]:
        return self.kfp_service.get_all_runs()

    def run_template(
        self,
        pipeline_template_name: str,
        run_params: RunParams,
        usertoken: str = "",
    ) -> str:
        return self.template_service.run_pipeline_template(
            pipeline_name=pipeline_template_name,
            params=run_params,
            user_token=usertoken,
            user_id=self.user.id,
        )
