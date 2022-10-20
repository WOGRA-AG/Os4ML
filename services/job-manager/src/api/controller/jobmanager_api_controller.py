from typing import List

from fastapi import Depends, HTTPException, status
from fastapi.responses import FileResponse

from build.openapi_server.models.create_pipeline import CreatePipeline
from build.openapi_server.models.create_run import CreateRun
from build.openapi_server.models.experiment import Experiment
from build.openapi_server.models.pipeline import Pipeline
from build.openapi_server.models.pipeline_template import PipelineTemplate
from build.openapi_server.models.run import Run
from build.openapi_server.models.run_params import RunParams
from build.openapi_server.models.solution import Solution
from build.openapi_server.models.user import User
from executor.kfp_executor import KfpExecutor
from services import BUCKET_NAME
from services.auth_service import get_parsed_token
from services.solution_service import SolutionService
from services.template_service import TemplateService


class JobmanagerApiController:
    def __init__(
        self,
        kfp_service: KfpExecutor = Depends(),
        solution_service: SolutionService = Depends(),
        template_service: TemplateService = Depends(),
        user: User = Depends(get_parsed_token),
        bucket_name: str = BUCKET_NAME,
    ):
        self.kfp_service = kfp_service
        self.solution_service = solution_service
        self.template_service = template_service
        self.user = user
        self.bucket_name = bucket_name

    def get_all_experiments(self, usertoken: str = "") -> List[Experiment]:
        return self.kfp_service.get_all_experiments()

    def post_experiment(
        self, experiment: Experiment, usertoken: str = ""
    ) -> str:
        return self.kfp_service.create_experiment(experiment)

    def get_all_pipelines(self, usertoken: str = "") -> List[Pipeline]:
        return self.kfp_service.get_all_pipelines()

    def post_pipeline(
        self, create_pipeline: CreatePipeline, usertoken: str = ""
    ) -> str:
        return self.kfp_service.create_pipeline(create_pipeline)

    def get_all_runs(self, usertoken: str = "") -> List[Run]:
        return self.kfp_service.get_all_runs()

    def get_run(self, run_id: str, usertoken: str = "") -> Run:
        return self.kfp_service.get_run(run_id)

    def post_run(
        self,
        experiment_id: str,
        pipeline_id: str,
        create_run: CreateRun,
        usertoken: str = "",
    ) -> str:
        return self.kfp_service.create_run(
            experiment_id, pipeline_id, create_run
        )

    def post_solution(self, solution: Solution, usertoken: str = "") -> str:
        return self.solution_service.create_solution(
            self.bucket_name,
            solution,
            user_token=usertoken,
            user_id=self.user.id,
        )

    def post_template(
        self,
        pipeline_template_name: str,
        run_params: RunParams,
        usertoken: str = "",
    ) -> str:
        run_params.bucket = run_params.bucket or self.bucket_name
        return self.template_service.run_pipeline_template(
            pipeline_name=pipeline_template_name,
            params=run_params,
            user_token=usertoken,
            user_id=self.user.id,
        )

    def get_all_pipeline_templates(
        self, usertoken: str = ""
    ) -> List[PipelineTemplate]:
        return self.template_service.get_all_pipeline_templates()

    def get_pipeline_template_by_name(
        self, pipeline_template_name: str, usertoken: str = ""
    ) -> PipelineTemplate:
        try:
            return self.template_service.get_pipeline_template_by_name(
                pipeline_template_name
            )
        except ValueError:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Pipeline with name {pipeline_template_name} not found",
            )

    def get_pipeline_file_by_name(
        self, pipeline_template_name: str, usertoken: str = ""
    ) -> FileResponse:
        try:
            pipeline_file_path = self.template_service.get_pipeline_file_path(
                pipeline_template_name,
                user_token=usertoken,
                user_id=self.user.id,
            )
        except ValueError:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"No file for Pipeline with name {pipeline_template_name} not found",
            )
        return FileResponse(pipeline_file_path)

    def get_all_solutions(self, usertoken: str = "") -> List[Solution]:
        return self.solution_service.get_all_solutions(
            bucket_name=self.bucket_name,
            user_token=usertoken,
        )

    def get_solution(
        self, solution_name: str, usertoken: str = ""
    ) -> Solution:
        return self.solution_service.get_solution(
            bucket_name=self.bucket_name,
            solution_name=solution_name,
            user_token=usertoken,
        )

    def put_solution(
        self, solution_name: str, solution: Solution, usertoken: str = ""
    ) -> Solution:
        return self.solution_service.put_solution(
            bucket_name=self.bucket_name,
            solution_name=solution_name,
            solution=solution,
            user_token=usertoken,
        )

    def delete_solution(self, solution_name: str, usertoken: str = "") -> None:
        return self.solution_service.delete_solution(
            bucket_name=self.bucket_name,
            solution_name=solution_name,
            user_token=usertoken,
        )

    def delete_run(self, run_id: str, usertoken: str = "") -> None:
        return self.kfp_service.delete_run(run_id)

    def get_download_link_for_model_of_solution(
        self, solution_name: str, usertoken: str = ""
    ) -> str:
        return self.solution_service.get_model_download_url(
            solution_name,
            self.bucket_name,
            user_token=usertoken,
        )
