import pathlib
import uuid

from build.openapi_server.models.create_pipeline import CreatePipeline
from build.openapi_server.models.create_run import CreateRun
from build.openapi_server.models.experiment import Experiment
from build.openapi_server.models.run_params import RunParams
from build.translator_client.api.workflowtranslator_api import (
    WorkflowtranslatorApi,
)
from executor.kfp_executor import KfpExecutor
from services import (
    PIPELINE_FILE_NAME,
    PIPELINE_TEMPLATES_DIR,
    TEMPLATE_METADATA_FILE_NAME,
)


class TemplateService:
    def __init__(self, kfp_client=None):
        self.kfp_service = KfpExecutor(client=kfp_client)
        self.workflowtranslator = WorkflowtranslatorApi()
        self.pipeline_templates_dir = pathlib.Path(PIPELINE_TEMPLATES_DIR)
        self.pipeline_file_name = PIPELINE_FILE_NAME
        self.template_metadata_file_name = TEMPLATE_METADATA_FILE_NAME

    def run_pipeline_template(
        self,
        pipeline_name: str,
        params: RunParams,
        user_token: str,
        user_id: str,
    ) -> str:
        name = f"{uuid.uuid4()}_{pipeline_name}"

        experiment = Experiment(name=name, description=name)
        exp_id: str = self.kfp_service.create_experiment(experiment)

        # TODO reenable
        # pipe_file_path = self.get_pipeline_file_path(
        #     pipeline_name, user_token=user_token, user_id=user_id
        # )
        pipe_file_path = ""
        pipeline = CreatePipeline(
            name=name, description=name, config_url=pipe_file_path
        )
        pipe_id: str = self.kfp_service.create_pipeline_from_local_file(
            pipeline
        )

        run = CreateRun(name=name, description=name, params=params)
        run_id: str = self.kfp_service.create_run(exp_id, pipe_id, run)
        return run_id

    def _iter_pipeline_dirs(self):
        return (
            pipeline_dir
            for pipeline_dir in self.pipeline_templates_dir.iterdir()
            if pipeline_dir.is_dir()
        )
