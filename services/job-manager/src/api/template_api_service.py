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
