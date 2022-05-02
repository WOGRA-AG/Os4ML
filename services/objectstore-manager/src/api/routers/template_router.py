from typing import List

from fastapi import APIRouter, Depends, Path

from src.models import PipelineTemplate
from src.services import MinioService

router = APIRouter(prefix="/apis/v1beta1")


@router.get(
    "/objectstore/template/component",
    responses={200: {"model": List[PipelineTemplate], "description": "OK"},},
    tags=["objectstore", "template"],
    summary="get all component templates",
)
async def get_all_component_templates(
    minio_service: MinioService = Depends(MinioService),
) -> List[PipelineTemplate]:
    return minio_service.get_all_pipeline_templates("components")


@router.get(
    "/objectstore/template/pipeline",
    responses={200: {"model": List[PipelineTemplate], "description": "OK"},},
    tags=["objectstore", "template"],
    summary="get all pipeline templates",
)
async def get_all_pipeline_templates(
    minio_service: MinioService = Depends(MinioService),
) -> List[PipelineTemplate]:
    return minio_service.get_all_pipeline_templates("pipelines")


@router.get(
    "/objectstore/template/component/{component_name}",
    responses={200: {"model": PipelineTemplate, "description": "OK"},},
    tags=["objectstore", "template"],
    summary="get component template by name",
)
async def get_component_template_by_name(
    component_name: str = Path(..., description="Name of Component Template"),
    minio_service: MinioService = Depends(MinioService),
) -> PipelineTemplate:
    return minio_service.get_pipeline_template_by_name(
        "components", component_name
    )


@router.get(
    "/objectstore/template/pipeline/{pipeline_name}",
    responses={200: {"model": PipelineTemplate, "description": "OK"},},
    tags=["objectstore", "template"],
    summary="get pipeline template by name",
)
async def get_pipeline_template_by_name(
    pipeline_name: str = Path(..., description="Name of Pipeline Template"),
    minio_service: MinioService = Depends(MinioService),
) -> PipelineTemplate:
    return minio_service.get_pipeline_template_by_name(
        "pipelines", pipeline_name
    )
