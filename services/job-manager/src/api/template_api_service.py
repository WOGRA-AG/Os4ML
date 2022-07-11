from typing import List

from fastapi import HTTPException, status
from fastapi.responses import FileResponse

from build.openapi_server.models.pipeline_template import PipelineTemplate
from build.openapi_server.models.run_params import RunParams
from services.template_service import TemplateService


class TemplateApiService:
    def __init__(self, template_service=None):
        self.template_service = (
            template_service
            if template_service is not None
            else TemplateService()
        )

    def post_template(
        self, pipeline_template_name: str, run_params: RunParams
    ) -> str:
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
        except StopIteration:
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
