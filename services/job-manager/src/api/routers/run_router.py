# coding: utf-8
from typing import List

from fastapi import APIRouter, Body, Depends, Path

from src.models import CreateRun, Run
from src.services.kfp_service import KfpService

router = APIRouter(prefix="/apis/v1beta1")


@router.get(
    "/jobmanager/run",
    responses={200: {"model": List[Run], "description": "Success"}},
    tags=["jobmanager", "run"],
    summary="Get all pipeline runs",
)
async def get_all_runs(kfp_service: KfpService = Depends(KfpService),) -> List[Run]:
    return kfp_service.get_all_runs()


@router.get(
    "/jobmanager/run/{run_id}",
    responses={200: {"model": Run, "description": "Success"},},
    tags=["jobmanager", "run"],
    summary="Get single pipeline run",
)
async def get_run(
    run_id: str = Path(None, description="Id of Run"), kfp_service: KfpService = Depends(KfpService)
) -> Run:
    return kfp_service.get_run(run_id)


@router.post(
    "/jobmanager/experiment/{experiment_id}/pipeline/{pipeline_id}/run",
    responses={201: {"description": "New resource created"}},
    tags=["jobmanager", "run"],
    summary="Create Run",
)
async def post_run(
    experiment_id: str = Path(None, description="Id of Experiment"),
    pipeline_id: str = Path(None, description="Id of Pipeline"),
    run: CreateRun = Body(None, description=""),
    kfp_service: KfpService = Depends(KfpService),
) -> str:
    return kfp_service.create_run(experiment_id, pipeline_id, run)
