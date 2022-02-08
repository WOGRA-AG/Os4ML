# coding: utf-8
from typing import List

from fastapi import APIRouter, Body, Path, Depends

from src.models import Run
from src.services.kfp_service import KfpService

router = APIRouter(prefix="/apis/v1beta1")


@router.get(
    "/jobmanager/experiment/{ExperimentId}/pipeline/{PipelineId}/run",
    responses={200: {"model": List[Run], "description": "Success"}},
    tags=["jobmanager", "run"],
    summary="Get all pipeline runs",
)
async def get_all_runs(
    experiment_id: int = Path(None, description="Id of Experiment"),
    pipeline_id: int = Path(None, description="Id of Pipeline"),
    kfp_service: KfpService = Depends(KfpService),
) -> List[Run]:
    ...


@router.post(
    "/apis/v1beta1/jobmanager/experiment/{ExperimentId}/pipeline/{PipelineId}/run",
    responses={201: {"description": "New resource created"}},
    tags=["jobmanager", "run"],
    summary="Create Run",
)
async def post_run(
    experiment_id: int = Path(None, description="Id of Experiment"),
    pipeline_id: int = Path(None, description="Id of Pipeline"),
    run: Run = Body(None, description=""),
    kfp_service: KfpService = Depends(KfpService),
) -> None:
    ...
