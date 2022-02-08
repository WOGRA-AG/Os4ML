# coding: utf-8
from typing import List

from fastapi import APIRouter, Path, Depends

from src.models import Artifact
from src.services.kfp_service import KfpService

router = APIRouter(prefix="/apis/v1beta1")


@router.get(
    "/jobmanager/experiment/{ExperimentId}/pipeline/{PipelineId}/artifacts",
    responses={200: {"model": List[Artifact], "description": "Success"}},
    tags=["jobmanager", "artifact"],
    summary="Get all pipeline artifacts",
)
async def get_all_artifacts(
    experiment_id: int = Path(..., description="Id of Experiment"),
    pipeline_id: int = Path(..., description="Id of Pipeline"),
    kfp_service: KfpService = Depends(KfpService),
) -> List[Artifact]:
    ...
