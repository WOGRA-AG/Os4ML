from typing import List

from build.openapi_server.models.bucket import Bucket
from build.openapi_server.models.item import Item
from build.openapi_server.models.url import Url
from services.minio_service import MinioService


class BucketApiService:
    def __init__(self, minio_service=None):
        self.minio_service: MinioService = (minio_service if minio_service is not None else MinioService())

    def delete_bucket(self, bucket_name) -> None:
        return self.minio_service.delete_bucket(bucket_name=bucket_name)

    def delete_object_by_name(self, bucket_name, object_name) -> None:
        return self.minio_service.delete_object(bucket_name=bucket_name, object_name=object_name)

    def get_all_objects(self, bucket_name) -> List[Item]:
        return self.minio_service.list_objects(bucket_name=bucket_name)

    def get_object_by_name(self, bucket_name, object_name) -> str:
        return self.minio_service.get_presigned_get_url(bucket_name=bucket_name, object_name=object_name)

    def get_object_url(self, bucket_name, object_name) -> str:
        return self.minio_service.get_presigned_get_url(bucket_name=bucket_name, object_name=object_name)

    def get_presigned_put_url(self, bucket_name, object_name) -> Url:
        return self.minio_service.get_presigned_put_url(bucket_name=bucket_name, object_name=object_name)

    def post_new_bucket(self, bucket_name) -> Bucket:
        return self.minio_service.create_bucket(bucket_name=bucket_name)
