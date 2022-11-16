from fastapi import Depends

from build.openapi_server.models.user import User
from services.auth_service import get_parsed_token
from src.services.pipeline_template_service import PipelineTemplateService


class WorkflowtranslatorApiController:
    def __init__(
        self,
        template_service: PipelineTemplateService = Depends(),
        user: User = Depends(get_parsed_token),
    ):
        self.template_service: PipelineTemplateService = template_service
        self.user: User = user

    def get_pipeline_template_by_name(
        self,
        pipeline_template_name: str,
        usertoken: str = "",
    ) -> dict:
        return self.template_service.get_pipeline_template(
            template_name=pipeline_template_name, user_token=usertoken
        )
