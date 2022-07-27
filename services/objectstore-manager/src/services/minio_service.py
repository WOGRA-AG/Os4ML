import json
from contextlib import contextmanager
from io import BytesIO
from typing import List, Optional

from fastapi import HTTPException
from minio import Minio
from minio.datatypes import Bucket as MinioBucket
from minio.datatypes import Object as MinioObject
from minio.deleteobjects import DeleteObject
from urllib3 import HTTPResponse

from build.openapi_server.models.bucket import Bucket
from build.openapi_server.models.item import Item
from services.storage_service_interface import StorageService


class MinioService(StorageService):
    def __init__(
        self,
        client: Minio,
    ):
        self.client = client

    def _check_if_bucket_exists(self, bucket_name):
        if not self.client.bucket_exists(bucket_name):
            raise HTTPException(
                status_code=404,
                detail=f"Bucket with name {bucket_name} not found",
            )

    def list_buckets(self) -> List[Bucket]:
        buckets: List[MinioBucket] = self.client.list_buckets()
        return [Bucket(name=bucket.name) for bucket in buckets]

    def create_bucket(self, bucket_name: str) -> str:
        if self.client.bucket_exists(bucket_name):
            return bucket_name
        try:
            self.client.make_bucket(bucket_name, location="europe-west4")
        except ValueError as err:
            raise HTTPException(status_code=400, detail=str(err))
        return bucket_name

    def get_bucket(self, bucket_name: str) -> Bucket:
        self._check_if_bucket_exists(bucket_name)
        return Bucket(name=bucket_name)

    def delete_bucket(self, bucket_name: str) -> None:
        if not self.client.bucket_exists(bucket_name):
            return
        self.delete_items(bucket_name, path_prefix="")
        self.client.remove_bucket(bucket_name)

    def list_items(self, bucket_name: str, path_prefix: str) -> List[Item]:
        self._check_if_bucket_exists(bucket_name)
        objects: List[MinioObject] = self.client.list_objects(
            bucket_name, recursive=True, prefix=path_prefix
        )
        return [
            Item(
                bucket_name=minio_object.bucket_name,
                object_name=minio_object.object_name,
            )
            for minio_object in objects
        ]

    def delete_items(self, bucket_name: str, path_prefix: str) -> None:
        self._check_if_bucket_exists(bucket_name)
        objects = self.client.list_objects(
            bucket_name, recursive=True, prefix=path_prefix
        )
        delete_objects = (DeleteObject(obj.object_name) for obj in objects)
        errors = self.client.remove_objects(bucket_name, delete_objects)
        if errors:
            for error in errors:
                print(error)

    def get_item(self, bucket_name: str, object_name: str) -> Item:
        self._check_if_bucket_exists(bucket_name)
        try:
            self.client.get_object(bucket_name, object_name)
        except:
            raise HTTPException(
                status_code=404,
                detail=f"Object with name {object_name} not found",
            )
        return Item(bucket_name=bucket_name, object_name=object_name)

    def get_presigned_get_url(self, bucket_name: str, object_name: str) -> str:
        self._check_if_bucket_exists(bucket_name)
        return self.client.presigned_get_object(bucket_name, object_name)

    def get_presigned_put_url(self, bucket_name: str, object_name: str) -> str:
        self._check_if_bucket_exists(bucket_name)
        return self.client.get_presigned_url("PUT", bucket_name, object_name)

    def delete_item(self, bucket_name: str, object_name: str) -> None:
        self._check_if_bucket_exists(bucket_name)
        self.client.remove_object(bucket_name, object_name)

    def create_item(
        self,
        bucket_name: str,
        object_name: str,
        data: BytesIO,
        size: int,
        content_type: str,
    ) -> Item:
        self._check_if_bucket_exists(bucket_name)
        self.client.put_object(
            bucket_name, object_name, data, size, content_type
        )
        return Item(bucket_name=bucket_name, object_name=object_name)

    def create_item_by_filename(
        self,
        bucket_name: str,
        object_name: str,
        file_name: str,
        size: Optional[int] = None,
        content_type: Optional[str] = None,
    ) -> Item:
        self._check_if_bucket_exists(bucket_name)
        self.client.fput_object(bucket_name, object_name, file_name)
        return Item(bucket_name=bucket_name, object_name=object_name)

    def get_json_object_from_bucket(self, bucket_name, json_file_name) -> dict:
        self._check_if_bucket_exists(bucket_name)
        with self._get_minio_object_context(
            bucket_name, json_file_name
        ) as response:
            return json.loads(response.data)

    def get_object_from_bucket(self, bucket_name, file_name) -> str:
        self._check_if_bucket_exists(bucket_name)
        with self._get_minio_object_context(
            bucket_name, file_name
        ) as response:
            return response.data

    @contextmanager
    def _get_minio_object_context(self, bucket_name, file_name):
        response: HTTPResponse = self.client.get_object(bucket_name, file_name)
        try:
            yield response
        finally:
            response.close()
            response.release_conn()
