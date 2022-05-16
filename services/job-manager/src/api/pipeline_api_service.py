from typing import List

from build.openapi_server.models.create_pipeline import CreatePipeline
from build.openapi_server.models.pipeline import Pipeline
from services.kfp_service import KfpService


class PipelineApiService:
    def __init__(self, kfp_service=None):
        self.kfp_service = (
            kfp_service if kfp_service is not None else KfpService()
        )

    def get_all_pipelines(self) -> List[Pipeline]:
        return self.kfp_service.get_all_pipelines()

    def post_pipeline(self, create_pipeline: CreatePipeline) -> str:
        return self.kfp_service.create_pipeline(create_pipeline)
