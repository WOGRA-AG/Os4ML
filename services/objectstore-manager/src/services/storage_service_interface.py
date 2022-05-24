from io import BytesIO
from typing import List

from build.openapi_server.models.bucket import Bucket
from build.openapi_server.models.databag import Databag
from build.openapi_server.models.item import Item
from build.openapi_server.models.url import Url


class StorageServiceInterface:
    def get_buckets(self) -> List[Bucket]:
        raise NotImplementedError()

    def create_bucket(self, bucket_name: str) -> Bucket:
        raise NotImplementedError()

    def delete_bucket(self, bucket_name: str) -> None:
        raise NotImplementedError()

    def list_objects(self, bucket_name: str) -> List[Item]:
        raise NotImplementedError()

    def get_presigned_get_url(self, bucket_name: str, object_name: str) -> str:
        raise NotImplementedError()

    def get_presigned_put_url(self, bucket_name: str, object_name: str) -> Url:
        raise NotImplementedError()

    def delete_object(self, bucket_name: str, object_name: str) -> None:
        raise NotImplementedError()

    def put_object(
        self,
        bucket_name: str,
        object_name: str,
        data: BytesIO,
        size: int,
        content_type: str,
    ) -> None:
        raise NotImplementedError()

    def get_databags(self) -> List[Databag]:
        raise NotImplementedError()

    def bucket_is_databag(self, bucket_name: str) -> bool:
        raise NotImplementedError()

    def get_databag_by_bucket_name(self, bucket_name: str) -> Databag:
        raise NotImplementedError()

    def put_databag_by_bucket_name(self, bucket_name: str, databag: Databag):
        raise NotImplementedError()
