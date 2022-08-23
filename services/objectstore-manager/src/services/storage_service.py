import json
from typing import List

from build.openapi_server.models.bucket import Bucket
from build.openapi_server.models.item import Item
from repository import StorageRepository


class StorageService:
    def __init__(
        self,
        storage_repository: StorageRepository,
    ):
        self.storage = storage_repository

    def delete_object_by_name(self, bucket_name, object_name) -> None:
        return self.storage.delete_item(
            bucket_name=bucket_name, object_name=object_name
        )

    def list_objects(self, bucket_name, path_prefix) -> List[Item]:
        return self.storage.list_items(
            bucket_name=bucket_name, path_prefix=path_prefix
        )

    def get_object_by_name(self, bucket_name, object_name) -> str:
        return self.storage.get_presigned_get_url(
            bucket_name=bucket_name, object_name=object_name
        )

    def get_json_object_by_name(
        self, bucket_name: str, object_name: str
    ) -> str:
        json_dict = self.storage.get_json_object_from_bucket(
            bucket_name, object_name
        )
        return json.dumps(json_dict)

    def get_presigned_object_url(self, bucket_name, object_name) -> str:
        return self.storage.get_presigned_get_url(
            bucket_name=bucket_name, object_name=object_name
        )

    def get_presigned_put_url(self, bucket_name, object_name) -> str:
        return self.storage.get_presigned_put_url(
            bucket_name=bucket_name, object_name=object_name
        )

    def create_item_by_name(
        self, bucket_name, object_name, file, size
    ) -> Item:
        return self.storage.create_item(
            bucket_name=bucket_name,
            object_name=object_name,
            data=file,
            size=size,
            content_type="application/octet-stream",
        )

    def delete_bucket(self, bucket_name) -> None:
        return self.storage.delete_bucket(bucket_name=bucket_name)

    def create_bucket(self, bucket_name) -> str:
        return self.storage.create_bucket(bucket_name=bucket_name)

    def list_buckets(self) -> List[Bucket]:
        return self.storage.list_buckets()

    def delete_objects(self, bucket_name: str, path_prefix: str) -> None:
        return self.storage.delete_items(
            bucket_name=bucket_name, path_prefix=path_prefix
        )
