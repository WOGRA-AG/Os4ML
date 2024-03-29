import json
from typing import List

from fastapi import Depends

from repository import StorageRepository
from repository.init_repository import init_repository
from services import BUCKET_NAME


class StorageService:
    def __init__(
        self,
        storage_repository: StorageRepository = Depends(init_repository),
        bucket_name: str = BUCKET_NAME,
    ):
        self.storage = storage_repository
        self.bucket_name = bucket_name

    def create_object_by_name(self, object_name, file, size) -> str:
        return self.storage.create_object(
            bucket_name=self.bucket_name,
            object_name=object_name,
            data=file,
            size=size,
            content_type="application/octet-stream",
        )

    def delete_object_by_name(self, object_name) -> None:
        return self.storage.delete_object(
            bucket_name=self.bucket_name, object_name=object_name
        )

    def list_objects(self, path_prefix) -> List[str]:
        return self.storage.list_objects(
            bucket_name=self.bucket_name, path_prefix=path_prefix
        )

    def delete_objects(self, path_prefix: str) -> None:
        return self.storage.delete_objects(
            bucket_name=self.bucket_name, path_prefix=path_prefix
        )

    def get_json_object_by_name(self, object_name: str) -> str:
        json_dict = self.storage.get_json_object_from_bucket(
            self.bucket_name, object_name
        )
        return json.dumps(json_dict)

    def get_presigned_get_url(self, object_name) -> str:
        return self.storage.get_presigned_get_url(
            bucket_name=self.bucket_name, object_name=object_name
        )

    def get_presigned_put_url(self, object_name) -> str:
        return self.storage.get_presigned_put_url(
            bucket_name=self.bucket_name, object_name=object_name
        )
