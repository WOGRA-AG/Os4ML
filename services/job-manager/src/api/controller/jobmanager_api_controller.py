from typing import List

from fastapi import HTTPException, status
from fastapi.responses import FileResponse, RedirectResponse

from build.openapi_server.models.create_pipeline import CreatePipeline
from build.openapi_server.models.create_run import CreateRun
from build.openapi_server.models.experiment import Experiment
from build.openapi_server.models.pipeline import Pipeline
from build.openapi_server.models.pipeline_template import PipelineTemplate
from build.openapi_server.models.run import Run
from build.openapi_server.models.run_params import RunParams
from build.openapi_server.models.solution import Solution
from executor.kfp_executor import KfpExecutor
from services import BUCKET_NAME
from services.solution_service import SolutionService
from services.template_service import TemplateService


class JobmanagerApiController:
    def __init__(
        self,
        kfp_service=None,
        solution_service=None,
        template_service=None,
        bucket_name=BUCKET_NAME,
    ):
        self.kfp_service = (
            kfp_service if kfp_service is not None else KfpExecutor()
        )
        self.solution_service = (
            solution_service
            if solution_service is not None
            else SolutionService()
        )
        self.template_service = (
            template_service
            if template_service is not None
            else TemplateService()
        )

        self.bucket_name = bucket_name

    def get_all_experiments(self) -> List[Experiment]:
        return self.kfp_service.get_all_experiments()

    def post_experiment(self, experiment: Experiment) -> str:
        return self.kfp_service.create_experiment(experiment)

    def get_all_pipelines(self) -> List[Pipeline]:
        return self.kfp_service.get_all_pipelines()

    def post_pipeline(self, create_pipeline: CreatePipeline) -> str:
        return self.kfp_service.create_pipeline(create_pipeline)

    def get_all_runs(self) -> List[Run]:
        return self.kfp_service.get_all_runs()

    def get_run(self, run_id: str) -> Run:
        return self.kfp_service.get_run(run_id)

    def post_run(
        self, experiment_id: str, pipeline_id: str, create_run: CreateRun
    ) -> str:
        return self.kfp_service.create_run(
            experiment_id, pipeline_id, create_run
        )

    def post_solution(self, solution: Solution) -> str:
        return self.solution_service.create_solution(
            self.bucket_name, solution
        )

    def post_template(
        self, pipeline_template_name: str, run_params: RunParams
    ) -> str:
        run_params.bucket = run_params.bucket or self.bucket_name
        return self.template_service.run_pipeline_template(
            pipeline_template_name, run_params
        )

    def get_all_pipeline_templates(self) -> List[PipelineTemplate]:
        return self.template_service.get_all_pipeline_templates()

    def get_pipeline_template_by_name(
        self, pipeline_template_name: str
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
        self, pipeline_template_name: str
    ) -> FileResponse:
        try:
            pipeline_file_path = self.template_service.get_pipeline_file_path(
                pipeline_template_name
            )
        except ValueError:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"No file for Pipeline with name {pipeline_template_name} not found",
            )
        return FileResponse(pipeline_file_path)

    def get_all_solutions(self) -> List[Solution]:
        return self.solution_service.get_all_solutions(
            bucket_name=self.bucket_name
        )

    def get_solution(self, solution_name: str) -> Solution:
        return self.solution_service.get_solution(
            bucket_name=self.bucket_name,
            solution_name=solution_name,
        )

    def put_solution(self, solution_name: str, solution: Solution) -> Solution:
        return self.solution_service.put_solution(
            bucket_name=self.bucket_name,
            solution_name=solution_name,
            solution=solution,
        )

    def delete_solution(self, solution_name: str) -> None:
        return self.solution_service.delete_solution(
            bucket_name=self.bucket_name,
            solution_name=solution_name,
        )

    def delete_run(self, run_id: str) -> None:
        return self.kfp_service.delete_run(run_id)

    def get_download_link_for_model_of_solution(
        self, solution_name: str
    ) -> str:
        return self.solution_service.get_model_download_url(
            solution_name, self.bucket_name
        )
