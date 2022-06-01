from io import BytesIO
from typing import List

from build.openapi_server.models.item import Item
from build.openapi_server.models.url import Url
from services.minio_service import MinioService


class ObjectApiService:
    def __init__(self, minio_service=None):
        self.minio_service: MinioService = (minio_service if minio_service is not None else MinioService())

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

    def put_object_by_name(self, bucket_name, object_name, body):
        file_content: bytes = body
        file: BytesIO = BytesIO(file_content)
        return self.minio_service.put_object(
            bucket_name=bucket_name,
            object_name=object_name,
            data=file,
            size=len(file_content),
            content_type="application/octet-stream",
        )
