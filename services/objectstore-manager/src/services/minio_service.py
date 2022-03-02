import json
from io import BytesIO
from typing import List

from fastapi import HTTPException
from minio import Minio
from minio.datatypes import Bucket as MinioBucket
from minio.datatypes import Object as MinioObject
from urllib3 import HTTPResponse

from src import CONFIG_FILE_NAME, MINIO_KEY, MINIO_SECRET, MINIO_SECURE, MINIO_URL
from src.models import Bucket, Databag, Item, Url

from .storage_service_interface import StorageServiceInterface


class MinioService(StorageServiceInterface):
    def __init__(
        self,
        minio_url: str = MINIO_URL,
        minio_key: str = MINIO_KEY,
        minio_secret: str = MINIO_SECRET,
        minio_secure: bool = MINIO_SECURE,
        config_file_name: str = CONFIG_FILE_NAME,
        client=None,
    ):
        if client is None:
            client = self.init_client(minio_url, minio_key, minio_secret, minio_secure)
        self.client = client
        self.config_file_name = config_file_name

    def init_client(self, minio_url: str, minio_key: str, minio_secret: str, minio_secure: bool) -> Minio:
        return Minio(endpoint=minio_url, access_key=minio_key, secret_key=minio_secret, secure=minio_secure)

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
        object_list: List[MinioObject] = self.client.list_objects(bucket_name)
        for o in object_list:
            self.client.remove_object(bucket_name, o.object_name)
        self.client.remove_bucket(bucket_name)

    def list_objects(self, bucket_name: str) -> List[Item]:
        if not self.client.bucket_exists(bucket_name):
            raise HTTPException(status_code=404, detail=f"Bucket with name {bucket_name} not found")
        objects: List[MinioObject] = self.client.list_objects(bucket_name)
        return [
            Item(bucket_name=minio_object.bucket_name, object_name=minio_object.object_name) for minio_object in objects
        ]

    def get_presigned_get_url(self, bucket_name: str, object_name: str) -> str:
        if not self.client.bucket_exists(bucket_name):
            raise HTTPException(status_code=404, detail=f"Bucket with name {bucket_name} not found")
        return self.client.get_presigned_url("GET", bucket_name, object_name)

    def get_presigned_put_url(self, bucket_name: str, object_name: str) -> Url:
        if not self.client.bucket_exists(bucket_name):
            raise HTTPException(status_code=404, detail=f"Bucket with name {bucket_name} not found")
        return Url(url=self.client.get_presigned_url("PUT", bucket_name, object_name))

    def delete_object(self, bucket_name: str, object_name: str) -> None:
        if not self.client.bucket_exists(bucket_name):
            raise HTTPException(status_code=404, detail=f"Bucket with name {bucket_name} not found")
        self.client.remove_object(bucket_name, object_name)

    def put_object(self, bucket_name: str, object_name: str, data: BytesIO, size: int, content_type: str) -> Item:
        if not self.client.bucket_exists(bucket_name):
            raise HTTPException(status_code=404, detail=f"Bucket with name {bucket_name} not found")
        self.client.put_object(bucket_name, object_name, data, size, content_type)
        return Item(bucket_name=bucket_name, object_name=object_name)

    def get_databags(self) -> List[Databag]:
        buckets: List[Bucket] = self.get_buckets()
        databag_buckets: List[Bucket] = [bucket for bucket in buckets if self.bucket_is_databag(bucket.name)]
        databags: List[Databag] = []
        for db in databag_buckets:
            try:
                response: HTTPResponse = self.client.get_object(db.name, self.config_file_name)
                databag: Databag = json.loads(response.data)
                databags.append(databag)
            finally:
                response.close()
                response.release_conn()
        return databags

    def bucket_is_databag(self, bucket_name: str) -> bool:
        minio_objects: List[MinioObject] = self.client.list_objects(bucket_name)
        return len(list(filter(lambda d: d.object_name == self.config_file_name, minio_objects))) > 0

    def get_databag_by_bucket_name(self, bucket_name: str) -> Databag:
        if not self.client.bucket_exists(bucket_name):
            raise HTTPException(status_code=404, detail=f"Bucket with name {bucket_name} not found")
        if not self.bucket_is_databag(bucket_name):
            raise HTTPException(status_code=400, detail=f"Bucket with name {bucket_name} is not a databag")
        try:
            response: HTTPResponse = self.client.get_object(bucket_name, self.config_file_name)
            return json.loads(response.data)
        finally:
            response.close()
            response.release_conn()

    def put_databag_by_bucket_name(self, bucket_name: str, databag: Databag):
        if not self.client.bucket_exists(bucket_name):
            raise HTTPException(status_code=404, detail=f"Bucket with name {bucket_name} not found")
        with open(f"/tmp/{self.config_file_name}", "w") as file:
            json.dump(databag.dict(), file)
        self.client.fput_object(bucket_name, self.config_file_name, file.name)
