from typing import List

from build.openapi_server.models.pipeline_template import PipelineTemplate
from services.minio_service import MinioService


class TemplateApiService:
    def __init__(self, minio_service=None):
        self.minio_service: MinioService = (
            minio_service if minio_service is not None else MinioService()
        )

    def get_all_component_templates(self) -> List[PipelineTemplate]:
        return self.minio_service.get_all_pipeline_templates("components")

    def get_all_pipeline_templates(self) -> List[PipelineTemplate]:
        return self.minio_service.get_all_pipeline_templates("pipelines")

    def get_component_template_by_name(
        self, component_name
    ) -> PipelineTemplate:
        return self.minio_service.get_pipeline_template_by_name(
            "components", component_name
        )

    def get_pipeline_template_by_name(self, pipeline_name) -> PipelineTemplate:
        return self.minio_service.get_pipeline_template_by_name(
            "pipelines", pipeline_name
        )
