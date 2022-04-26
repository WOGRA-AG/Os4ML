from typing import List

from build.openapi_server.models.pipeline import Pipeline
from build.openapi_server.models.create_pipeline import CreatePipeline

from services.kfp_service import KfpService


class PipelineApiRouter:

    @staticmethod
    def get_all_pipelines() -> List[Pipeline]:
        return KfpService().get_all_pipelines()

    @staticmethod
    def post_pipeline(pipeline: CreatePipeline) -> str:
        return KfpService().create_pipeline(pipeline)
