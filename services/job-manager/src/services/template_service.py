import uuid

from openapi_client.api.objectstore_api import ObjectstoreApi
from openapi_client.model.pipeline_template import PipelineTemplate
from openapi_server.models.create_run import CreateRun

from src.models import CreatePipeline, Experiment
from src.services.kfp_service import KfpService


class TemplateService:
    def __init__(self, kfp_client=None):
        self.kfp_service = KfpService(client=kfp_client)
        self.objectstore = ObjectstoreApi()

    async def run_pipeline_template(self, pipeline_name: str, params: dict) -> str:
        try:
            name: str = f"{uuid.uuid4()}_{pipeline_name}"
            pipe_template: PipelineTemplate = self.objectstore.get_pipeline_template_by_name(
                pipeline_name=pipeline_name
            )
            experiment: Experiment = Experiment(name=name, description=name)
            run: CreateRun = CreateRun(name=name, description=name, params=params)

            exp_id: str = self.kfp_service.create_experiment(experiment)
            pipeline: CreatePipeline = CreatePipeline(name=name, description=name, config_url=pipe_template.file_url)
            pipe_id: str = self.kfp_service.create_pipeline(pipeline)
            run_id: str = self.kfp_service.create_run(exp_id, pipe_id, run)
            return run_id
        except Exception as err:
            raise err
