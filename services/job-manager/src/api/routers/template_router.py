from fastapi import APIRouter, Body, Depends, Path

from models import RunParams
from src.services.template_service import TemplateService

router = APIRouter(prefix="/apis/v1beta1")


@router.post(
    "/jobmanager/template/{pipeline_template_name}",
    responses={201: {"model": str, "description": "Resource created"},},
    tags=["jobmanager", "template"],
    summary="Convenience route to run a Pipeline Template directly",
)
async def post_template(
    pipeline_template_name: str = Path(
        ..., description="Name of the PipelineTemplate to run"
    ),
    run_params: RunParams = Body(
        ..., description="Parameters to run the pipeline with"
    ),
    template_service: TemplateService = Depends(TemplateService),
) -> str:
    return template_service.run_pipeline_template(
        pipeline_template_name, run_params
    )
