from io import BytesIO
from typing import List, Optional

from build.openapi_server.models.bucket import Bucket
from build.openapi_server.models.item import Item


class StorageRepository:
    def get_bucket(self, bucket_name: str) -> Bucket:
        raise NotImplementedError()

    def list_buckets(self) -> List[Bucket]:
        raise NotImplementedError()

    def create_bucket(self, bucket_name: str) -> str:
        raise NotImplementedError()

    def delete_bucket(self, bucket_name: str) -> None:
        raise NotImplementedError()

    def list_items(self, bucket_name: str, path_prefix: str) -> List[Item]:
        raise NotImplementedError()

    def get_item(self, bucket_name: str, object_name: str) -> Item:
        raise NotImplementedError()

    def get_presigned_get_url(self, bucket_name: str, object_name: str) -> str:
        raise NotImplementedError()

    def get_presigned_put_url(self, bucket_name: str, object_name: str) -> str:
        raise NotImplementedError()

    def delete_item(self, bucket_name: str, object_name: str) -> None:
        raise NotImplementedError()

    def delete_items(self, bucket_name: str, path_prefix: str) -> None:
        raise NotImplementedError()

    def create_item(
        self,
        bucket_name: str,
        object_name: str,
        data: BytesIO,
        size: int,
        content_type: str,
    ) -> Item:
        raise NotImplementedError()

    def create_item_by_filename(
        self,
        bucket_name: str,
        object_name: str,
        file_name: str,
        size: Optional[int] = None,
        content_type: Optional[str] = None,
    ) -> Item:
        raise NotImplementedError()

    def get_json_object_from_bucket(self, bucket_name, json_file_name) -> dict:
        raise NotImplementedError()

    def get_object_from_bucket(self, bucket_name, file_name) -> str:
        raise NotImplementedError()
