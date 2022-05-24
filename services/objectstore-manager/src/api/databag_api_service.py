from typing import List

from build.openapi_server.models.databag import Databag
from services.minio_service import MinioService


class DatabagApiService:
    def __init__(self, minio_service=None):
        self.minio_service: MinioService = (minio_service if minio_service is not None else MinioService())

    def get_all_databags(self) -> List[Databag]:
        return self.minio_service.get_databags()

    def get_databag_by_bucket_name(self, bucket_name) -> Databag:
        return self.minio_service.get_databag_by_bucket_name(bucket_name=bucket_name)

    def put_databag_by_bucket_name(self, bucket_name, databag) -> None:
        return self.minio_service.put_databag_by_bucket_name(bucket_name=bucket_name, databag=databag)
