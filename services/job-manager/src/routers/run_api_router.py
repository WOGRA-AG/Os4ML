# coding: utf-8
from typing import List

from fastapi import APIRouter, Body, Depends, Path

from build.openapi_server.models.run import Run
from build.openapi_server.models.create_run import CreateRun

from services.kfp_service import KfpService

router = APIRouter(prefix="/apis/v1beta1")


class RunApiRouter:

    @staticmethod
    async def get_all_runs(kfp_service: KfpService = Depends(KfpService), ) -> List[Run]:
        return kfp_service.get_all_runs()

    @staticmethod
    async def get_run(
            run_id: str = Path(None, description="Id of Run"),
            kfp_service: KfpService = Depends(KfpService)
    ) -> Run:
        return kfp_service.get_run(run_id)

    @staticmethod
    async def post_run(
            experiment_id: str = Path(None, description="Id of Experiment"),
            pipeline_id: str = Path(None, description="Id of Pipeline"),
            run: CreateRun = Body(None, description=""),
            kfp_service: KfpService = Depends(KfpService),
    ) -> str:
        return kfp_service.create_run(experiment_id, pipeline_id, run)
