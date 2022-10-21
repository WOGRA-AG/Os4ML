from io import BytesIO
from typing import Protocol


class StorageRepository(Protocol):
    def create_object(
        self,
        bucket_name: str,
        object_name: str,
        data: BytesIO,
        size: int,
        content_type: str,
    ) -> str:
        ...

    def delete_object(self, bucket_name: str, object_name: str) -> None:
        ...

    def list_objects(self, bucket_name: str, path_prefix: str) -> list[str]:
        ...

    def delete_objects(self, bucket_name: str, path_prefix: str) -> None:
        ...

    def get_json_object_from_bucket(self, bucket_name, json_file_name) -> dict:
        ...

    def get_presigned_get_url(self, bucket_name: str, object_name: str) -> str:
        ...

    def get_presigned_put_url(self, bucket_name: str, object_name: str) -> str:
        ...
