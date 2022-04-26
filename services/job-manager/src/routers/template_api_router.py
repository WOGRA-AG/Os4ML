from build.openapi_server.models.run_params import RunParams

from services.template_service import TemplateService


class TemplateApiRouter:
    @staticmethod
    def post_template(pipeline_template_name: str, run_params: RunParams) -> str:
        return TemplateService().run_pipeline_template(pipeline_template_name, run_params)
