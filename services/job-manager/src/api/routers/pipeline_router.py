# coding: utf-8

from typing import List

from fastapi import APIRouter, Body, Path, Depends

from src.models import Pipeline
from src.services.kfp_service import KfpService

router = APIRouter(prefix="/apis/v1beta1")


@router.get(
    "/jobmanager/experiment/{ExperimentId}/pipeline",
    responses={200: {"model": List[Pipeline], "description": "Success"}},
    tags=["jobmanager", "pipeline"],
    summary="Get all pipelines",
)
async def get_all_pipelines(
    experiment_id: int = Path(..., description="Id of Experiment"),
    kfp_service: KfpService = Depends(KfpService),
) -> List[Pipeline]:
    ...


@router.post(
    "/jobmanager/experiment/{ExperimentId}/pipeline",
    responses={201: {"description": "New resource created"}},
    tags=["jobmanager", "pipeline"],
    summary="Create Pipeline",
)
async def post_pipeline(
    experiment_id: int = Path(..., description="Id of Experiment"),
    body: str = Body(..., description="Pipeline Yaml"),
    kfp_service: KfpService = Depends(KfpService),
) -> None:
    ...
