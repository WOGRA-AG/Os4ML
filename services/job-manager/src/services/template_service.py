import json
import pathlib
import uuid
from typing import Dict, List

import yaml
from fastapi import HTTPException

from build.openapi_server.models.create_pipeline import CreatePipeline
from build.openapi_server.models.create_run import CreateRun
from build.openapi_server.models.experiment import Experiment
from build.openapi_server.models.pipeline_template import PipelineTemplate
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
from services.init_api_clients import init_objectstore_api


class TemplateService:
    def __init__(self, kfp_client=None):
        self.kfp_service = KfpExecutor(client=kfp_client)
        self.objectstore = init_objectstore_api()
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

        pipe_file_path = self.get_pipeline_file_path(
            pipeline_name, user_token=user_token, user_id=user_id
        )
        pipeline = CreatePipeline(
            name=name, description=name, config_url=pipe_file_path
        )
        pipe_id: str = self.kfp_service.create_pipeline_from_local_file(
            pipeline
        )

        run = CreateRun(name=name, description=name, params=params)
        run_id: str = self.kfp_service.create_run(exp_id, pipe_id, run)
        return run_id

    def get_all_pipeline_templates(self) -> List[PipelineTemplate]:
        return [
            self._create_pipeline_template(pipeline_dir)
            for pipeline_dir in self._iter_pipeline_dirs()
        ]

    def get_pipeline_template_by_name(
        self, pipeline_name: str
    ) -> PipelineTemplate:
        pipeline_templates_with_name = [
            pipeline_template
            for pipeline_template in self.get_all_pipeline_templates()
            if pipeline_template.name == pipeline_name
        ]
        if not pipeline_templates_with_name:
            raise HTTPException(
                status_code=404,
                detail=f"PipelineTemplate with name {pipeline_name} not found",
            )
        return next(iter(pipeline_templates_with_name))

    def get_pipeline_file_path(
        self, pipeline_template_name: str, user_token: str, user_id: str
    ) -> str:
        pipeline_file: Dict[
            str, object
        ] = self.workflowtranslator.get_pipeline_template_by_name(
            pipeline_template_name, usertoken=user_token
        )
        tmp_pipeline_file = (
            self.pipeline_templates_dir
            / f"{user_id}_{self.pipeline_file_name}"
        )
        with open(tmp_pipeline_file, "w") as f:
            yaml.safe_dump(pipeline_file, f)
            return f.name

    def _iter_pipeline_dirs(self):
        return (
            pipeline_dir
            for pipeline_dir in self.pipeline_templates_dir.iterdir()
            if pipeline_dir.is_dir()
        )

    def _create_pipeline_template(
        self, pipeline_dir: pathlib.Path
    ) -> PipelineTemplate:
        metadata_file_name = pipeline_dir / self.template_metadata_file_name
        try:
            with open(metadata_file_name) as metadata_file:
                metadata = json.load(metadata_file)
            return PipelineTemplate(**metadata)
        except FileNotFoundError:
            return PipelineTemplate()
