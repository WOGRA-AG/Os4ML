from fastapi import APIRouter, Body, Path

from build.openapi_server.models.run_params import RunParams

from services.template_service import TemplateService

router = APIRouter(prefix="/apis/v1beta1")


class TemplateApiRouter:

    @staticmethod
    def post_template(
            pipeline_template_name: str = Path(...,
                                               description="Name of the PipelineTemplate to run"),
            run_params: RunParams = Body(...,
                                         description="Parameters to run the pipeline with"),
    ) -> str:
        return TemplateService().run_pipeline_template(pipeline_template_name,
                                                       run_params)
