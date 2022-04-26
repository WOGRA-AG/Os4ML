from typing import List

from build.openapi_server.models.experiment import Experiment
from build.openapi_server.models.pipeline import Pipeline
from build.openapi_server.models.create_run import CreateRun
from build.openapi_server.models.run import Run
from build.openapi_server.models.create_pipeline import CreatePipeline
from build.openapi_server.models.solution import Solution
from openapi_server.models.run_params import RunParams

from services.kfp_service import KfpService
from services.solution_service import SolutionService
from template_service import TemplateService


class JobmanagerApiRouter:
    @staticmethod
    def get_all_experiments() -> List[Experiment]:
        return KfpService().get_all_experiments()

    @staticmethod
    def post_experiment(experiment: Experiment) -> str:
        return KfpService().create_experiment(experiment)

    @staticmethod
    def get_all_pipelines() -> List[Pipeline]:
        return KfpService().get_all_pipelines()

    @staticmethod
    def get_all_runs() -> List[Run]:
        return KfpService().get_all_runs()

    @staticmethod
    def get_run(run_id: str) -> Run:
        return KfpService().get_run(run_id)

    @staticmethod
    def post_run(experiment_id: str, pipeline_id: str, create_run: CreateRun) -> str:
        return KfpService().create_run(experiment_id, pipeline_id, create_run)

    @staticmethod
    def post_pipeline(create_pipeline: CreatePipeline) -> str:
        return KfpService().create_pipeline(create_pipeline)

    @staticmethod
    def post_solution(solution: Solution) -> str:
        return SolutionService().create_solution(solution)

    @staticmethod
    def post_template(pipeline_template_name: str, run_params: RunParams) -> str:
        return TemplateService().run_pipeline_template(pipeline_template_name, run_params)
