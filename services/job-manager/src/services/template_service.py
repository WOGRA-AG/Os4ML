import uuid

from build.openapi_client.api.objectstore_api import ObjectstoreApi
from build.openapi_client.model.pipeline_template import PipelineTemplate
from build.openapi_server.models.create_pipeline import CreatePipeline
from build.openapi_server.models.create_run import CreateRun
from build.openapi_server.models.experiment import Experiment
from build.openapi_server.models.run_params import RunParams
from services.kfp_service import KfpService


class TemplateService:
    def __init__(self, kfp_client=None):
        self.kfp_service = KfpService(client=kfp_client)
        self.objectstore = ObjectstoreApi()

    def run_pipeline_template(self, pipeline_name: str, params: RunParams) -> str:
        name: str = f"{uuid.uuid4()}_{pipeline_name}"
        pipe_template: PipelineTemplate = self.objectstore.get_pipeline_template_by_name(pipeline_name=pipeline_name)
        experiment: Experiment = Experiment(name=name, description=name)
        run: CreateRun = CreateRun(name=name, description=name, params=params)

        exp_id: str = self.kfp_service.create_experiment(experiment)
        pipeline: CreatePipeline = CreatePipeline(name=name, description=name, config_url=pipe_template.file_url)
        pipe_id: str = self.kfp_service.create_pipeline(pipeline)
        run_id: str = self.kfp_service.create_run(exp_id, pipe_id, run)
        return run_id
