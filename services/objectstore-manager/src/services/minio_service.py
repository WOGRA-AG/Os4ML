import json
from contextlib import contextmanager
from io import BytesIO
from typing import List, Optional

from fastapi import HTTPException
from minio import Minio
from minio.datatypes import Bucket as MinioBucket
from minio.datatypes import Object as MinioObject
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
        if not self.client.bucket_exists(bucket_name):
            raise HTTPException(
                status_code=404,
                detail=f"Bucket with name {bucket_name} not found",
            )
        return Bucket(name=bucket_name)

    def delete_bucket(self, bucket_name: str) -> None:
        if not self.client.bucket_exists(bucket_name):
            return
        object_list: List[MinioObject] = self.client.list_objects(
            bucket_name, recursive=True
        )
        for o in object_list:
            self.client.remove_object(bucket_name, o.object_name)
        self.client.remove_bucket(bucket_name)

    def list_items(self, bucket_name: str, path_prefix: str) -> List[Item]:
        if not self.client.bucket_exists(bucket_name):
            raise HTTPException(
                status_code=404,
                detail=f"Bucket with name {bucket_name} not found",
            )
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

    def get_item(self, bucket_name: str, object_name: str) -> Item:
        if not self.client.bucket_exists(bucket_name):
            raise HTTPException(
                status_code=404,
                detail=f"Bucket with name {bucket_name} not found",
            )
        try:
            self.client.get_object(bucket_name, object_name)
        except:
            raise HTTPException(
                status_code=404,
                detail=f"Object with name {object_name} not found",
            )
        return Item(bucket_name=bucket_name, object_name=object_name)

    def get_presigned_get_url(self, bucket_name: str, object_name: str) -> str:
        if not self.client.bucket_exists(bucket_name):
            raise HTTPException(
                status_code=404,
                detail=f"Bucket with name {bucket_name} not found",
            )
        return self.client.presigned_get_object(bucket_name, object_name)

    def get_presigned_put_url(self, bucket_name: str, object_name: str) -> str:
        if not self.client.bucket_exists(bucket_name):
            raise HTTPException(
                status_code=404,
                detail=f"Bucket with name {bucket_name} not found",
            )
        return self.client.get_presigned_url("PUT", bucket_name, object_name)

    def delete_item(self, bucket_name: str, object_name: str) -> None:
        if not self.client.bucket_exists(bucket_name):
            raise HTTPException(
                status_code=404,
                detail=f"Bucket with name {bucket_name} not found",
            )
        self.client.remove_object(bucket_name, object_name)

    def create_item(
        self,
        bucket_name: str,
        object_name: str,
        data: BytesIO,
        size: int,
        content_type: str,
    ) -> Item:
        if not self.client.bucket_exists(bucket_name):
            raise HTTPException(
                status_code=404,
                detail=f"Bucket with name {bucket_name} not found",
            )
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
        if not self.client.bucket_exists(bucket_name):
            raise HTTPException(
                status_code=404,
                detail=f"Bucket with name {bucket_name} not found",
            )
        self.client.fput_object(bucket_name, object_name, file_name)
        return Item(bucket_name=bucket_name, object_name=object_name)

    def get_json_object_from_bucket(self, bucket_name, json_file_name) -> dict:
        if not self.client.bucket_exists(bucket_name):
            raise HTTPException(
                status_code=404,
                detail=f"Bucket with name {bucket_name} not found",
            )
        with self._get_minio_object_context(
            bucket_name, json_file_name
        ) as response:
            return json.loads(response.data)

    def get_object_from_bucket(self, bucket_name, file_name) -> str:
        if not self.client.bucket_exists(bucket_name):
            raise HTTPException(
                status_code=404,
                detail=f"Bucket with name {bucket_name} not found",
            )
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
