import json
from contextlib import contextmanager
from datetime import datetime
from io import BytesIO
from typing import List

from fastapi import HTTPException
from minio import Minio
from minio.datatypes import Bucket as MinioBucket
from minio.datatypes import Object as MinioObject
from urllib3 import HTTPResponse

from build.openapi_server.models.bucket import Bucket
from build.openapi_server.models.databag import Databag
from build.openapi_server.models.item import Item
from build.openapi_server.models.url import Url
from services import (
    COMPONENT_FILE_NAME,
    DATABAG_CONFIG_FILE_NAME,
    MINIO_KEY,
    MINIO_SECRET,
    MINIO_SECURE,
    MINIO_URL,
    PIPELINE_FILE_NAME,
    TEMPLATE_METADATA_FILE_NAME,
)
from services.storage_service_interface import StorageServiceInterface


class MinioService(StorageServiceInterface):
    def __init__(
        self,
        minio_url: str = MINIO_URL,
        minio_key: str = MINIO_KEY,
        minio_secret: str = MINIO_SECRET,
        minio_secure: bool = MINIO_SECURE,
        config_file_name: str = DATABAG_CONFIG_FILE_NAME,
        metadata_file_name: str = TEMPLATE_METADATA_FILE_NAME,
        component_file_name: str = COMPONENT_FILE_NAME,
        pipeline_file_name: str = PIPELINE_FILE_NAME,
        client=None,
    ):
        if client is None:
            client = self.init_client(
                minio_url, minio_key, minio_secret, minio_secure
            )
        self.client = client
        self.config_file_name = config_file_name
        self.metadata_file_name = metadata_file_name
        self.component_file_name = component_file_name
        self.pipeline_file_name = pipeline_file_name

    def init_client(
        self,
        minio_url: str,
        minio_key: str,
        minio_secret: str,
        minio_secure: bool,
    ) -> Minio:
        return Minio(
            endpoint=minio_url,
            access_key=minio_key,
            secret_key=minio_secret,
            secure=minio_secure,
        )

    def get_buckets(self) -> List[Bucket]:
        buckets: List[MinioBucket] = self.client.list_buckets()
        return [Bucket(name=bucket.name) for bucket in buckets]

    def create_bucket(self, bucket_name: str) -> Bucket:
        if self.client.bucket_exists(bucket_name):
            return Bucket(name=bucket_name)
        try:
            self.client.make_bucket(bucket_name)
        except ValueError as err:
            raise HTTPException(status_code=400, detail=str(err))
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

    def list_objects(self, bucket_name: str) -> List[Item]:
        if not self.client.bucket_exists(bucket_name):
            raise HTTPException(
                status_code=404,
                detail=f"Bucket with name {bucket_name} not found",
            )
        objects: List[MinioObject] = self.client.list_objects(bucket_name)
        return [
            Item(
                bucket_name=minio_object.bucket_name,
                object_name=minio_object.object_name,
            )
            for minio_object in objects
        ]

    def get_presigned_get_url(self, bucket_name: str, object_name: str) -> str:
        if not self.client.bucket_exists(bucket_name):
            raise HTTPException(
                status_code=404,
                detail=f"Bucket with name {bucket_name} not found",
            )
        return self.client.presigned_get_object(bucket_name, object_name)

    def get_presigned_put_url(self, bucket_name: str, object_name: str) -> Url:
        if not self.client.bucket_exists(bucket_name):
            raise HTTPException(
                status_code=404,
                detail=f"Bucket with name {bucket_name} not found",
            )
        return Url(
            url=self.client.get_presigned_url("PUT", bucket_name, object_name)
        )

    def delete_object(self, bucket_name: str, object_name: str) -> None:
        if not self.client.bucket_exists(bucket_name):
            raise HTTPException(
                status_code=404,
                detail=f"Bucket with name {bucket_name} not found",
            )
        self.client.remove_object(bucket_name, object_name)

    def put_object(
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

    def get_dict_from_bucket(self, bucket_name, json_file_name) -> dict:
        with self._get_minio_object_context(
            bucket_name, json_file_name
        ) as response:
            return json.loads(response.data)

    def get_object_from_bucket(self, bucket_name, file_name):
        with self._get_minio_object_context(
            bucket_name, file_name
        ) as response:
            return response.data

    def get_databags(self) -> List[Databag]:
        buckets: List[Bucket] = self.get_buckets()
        databag_buckets: List[Bucket] = [
            bucket for bucket in buckets if self.bucket_is_databag(bucket.name)
        ]
        databags: List[Databag] = []
        for db in databag_buckets:
            databag: Databag = Databag(
                **self.get_dict_from_bucket(db.name, self.config_file_name)
            )
            databags.append(databag)
        return databags

    def bucket_is_databag(self, bucket_name: str) -> bool:
        minio_objects: List[MinioObject] = self.client.list_objects(
            bucket_name
        )
        return self.object_list_has_file(minio_objects, self.config_file_name)

    def get_databag_by_bucket_name(self, bucket_name: str) -> Databag:
        if not self.client.bucket_exists(bucket_name):
            raise HTTPException(
                status_code=404,
                detail=f"Bucket with name {bucket_name} not found",
            )
        if not self.bucket_is_databag(bucket_name):
            raise HTTPException(
                status_code=400,
                detail=f"Bucket with name {bucket_name} is not a databag",
            )
        return Databag(
            **self.get_dict_from_bucket(bucket_name, self.config_file_name)
        )

    def put_databag_by_bucket_name(self, bucket_name: str, databag: Databag):
        if not self.client.bucket_exists(bucket_name):
            raise HTTPException(
                status_code=404,
                detail=f"Bucket with name {bucket_name} not found",
            )
        databag.creation_time = datetime.utcnow().strftime(
            "%Y-%m-%dT%H:%M:%SZ"
        )
        with open(f"/tmp/{self.config_file_name}", "w") as file:
            json.dump(databag.dict(), file)
        self.client.fput_object(bucket_name, self.config_file_name, file.name)

    def object_list_has_file(
        self, minio_objects: List[MinioObject], file_name: str
    ) -> bool:
        file_list = [i for i in minio_objects if i.object_name == file_name]
        return len(file_list) > 0

    @contextmanager
    def _get_minio_object_context(self, bucket_name, file_name):
        response: HTTPResponse = self.client.get_object(bucket_name, file_name)
        try:
            yield response
        finally:
            response.close()
            response.release_conn()
