from typing import List

from fastapi import APIRouter, Body, Depends

from src.models import CreatePipeline, Pipeline
from src.services.kfp_service import KfpService

router = APIRouter(prefix="/apis/v1beta1")


@router.get(
    "/jobmanager/pipeline",
    responses={200: {"model": List[Pipeline], "description": "Success"}},
    tags=["jobmanager", "pipeline"],
    summary="Get all pipelines",
)
async def get_all_pipelines(kfp_service: KfpService = Depends(KfpService),) -> List[Pipeline]:
    return kfp_service.get_all_pipelines()


@router.post(
    "/jobmanager/pipeline",
    responses={201: {"description": "New resource created"}},
    tags=["jobmanager", "pipeline"],
    summary="Create Pipeline",
)
async def post_pipeline(
    pipeline: CreatePipeline = Body(..., description=""), kfp_service: KfpService = Depends(KfpService),
) -> None:
    kfp_service.create_pipeline(pipeline)
