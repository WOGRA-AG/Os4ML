from typing import List

from fastapi import APIRouter, Body

from build.openapi_server.models.pipeline import Pipeline
from build.openapi_server.models.create_pipeline import CreatePipeline

from services.kfp_service import KfpService

router = APIRouter(prefix="/apis/v1beta1")


class PipelineApiRouter:

    @staticmethod
    def get_all_pipelines() -> List[Pipeline]:
        return KfpService().get_all_pipelines()

    @staticmethod
    def post_pipeline(
            pipeline: CreatePipeline = Body(..., description=""),
    ) -> str:
        return KfpService().create_pipeline(pipeline)
