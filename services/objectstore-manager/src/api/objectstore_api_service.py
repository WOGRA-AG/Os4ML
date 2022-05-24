from io import BytesIO
from typing import List

from build.openapi_server.models.bucket import Bucket
from build.openapi_server.models.item import Item
from build.openapi_server.models.pipeline_template import PipelineTemplate
from build.openapi_server.models.solution import Solution
from build.openapi_server.models.url import Url
from services.minio_service import MinioService
from services.solution_service import SolutionService


class ObjectstoreApiService:
    def __init__(self, minio_service=None, solution_service=None):
        self.minio_service: MinioService = (minio_service if minio_service is not None else MinioService())
        self.solution_service: SolutionService = (solution_service if solution_service is not None else SolutionService())

    def delete_object_by_name(self, bucket_name, object_name) -> None:
        return self.minio_service.delete_object(bucket_name=bucket_name,
                                                object_name=object_name)

    def get_all_objects(self, bucket_name) -> List[Item]:
        return self.minio_service.list_objects(bucket_name=bucket_name)

    def get_object_by_name(self, bucket_name, object_name) -> str:
        return self.minio_service.get_presigned_get_url(
            bucket_name=bucket_name, object_name=object_name)

    def get_object_url(self, bucket_name, object_name) -> str:
        return self.minio_service.get_presigned_get_url(
            bucket_name=bucket_name, object_name=object_name)

    def get_presigned_put_url(self, bucket_name, object_name) -> Url:
        return self.minio_service.get_presigned_put_url(
            bucket_name=bucket_name, object_name=object_name)

    def put_object_by_name(self, bucket_name, object_name,
                           body) -> Item:
        file_content: bytes = body
        file: BytesIO = BytesIO(file_content)
        return self.minio_service.put_object(
            bucket_name=bucket_name,
            object_name=object_name,
            data=file,
            size=len(file_content),
            content_type="application/octet-stream",
        )

    def delete_bucket(self, bucket_name) -> None:
        return self.minio_service.delete_bucket(bucket_name=bucket_name)

    def post_new_bucket(self, bucket_name) -> Bucket:
        return self.minio_service.create_bucket(bucket_name=bucket_name)

    def get_all_component_templates(self) -> List[PipelineTemplate]:
        return self.minio_service.get_all_pipeline_templates("components")

    def get_all_pipeline_templates(self) -> List[PipelineTemplate]:
        return self.minio_service.get_all_pipeline_templates("pipelines")

    def get_component_template_by_name(self, component_name) -> PipelineTemplate:
        return self.minio_service.get_pipeline_template_by_name("components", component_name)

    def get_pipeline_template_by_name(self, pipeline_name) -> PipelineTemplate:
        return self.minio_service.get_pipeline_template_by_name("pipelines", pipeline_name)

    def get_all_solutions(self) -> List[Solution]:
        return self.solution_service.get_all_solutions()
