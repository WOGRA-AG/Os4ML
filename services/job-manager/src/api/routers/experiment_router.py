from typing import List

from fastapi import APIRouter, Body, Depends

from src.models import Experiment
from src.services.kfp_service import KfpService

router = APIRouter(prefix="/apis/v1beta1")


@router.get(
    "/jobmanager/experiment",
    responses={200: {"model": List[Experiment], "description": "Success"}},
    tags=["jobmanager", "experiment"],
    summary="Get all Experiments",
)
async def get_all_experiments(
    kfp_service: KfpService = Depends(KfpService),
) -> List[Experiment]:
    return kfp_service.get_all_experiments()


@router.post(
    "/jobmanager/experiment",
    responses={201: {"description": "New resource created"}},
    tags=["jobmanager", "experiment"],
    summary="Create new Experiment",
)
async def post_experiment(
    experiment: Experiment = Body(..., description=""),
    kfp_service: KfpService = Depends(KfpService),
) -> str:
    return kfp_service.create_experiment(experiment)
