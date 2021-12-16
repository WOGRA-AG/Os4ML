from typing import List

from fastapi import HTTPException
from minio import Minio
from minio.datatypes import Bucket as MinioBucket
from minio.datatypes import Object

from models import Bucket, Item, Url
from src import MINIO_KEY, MINIO_SECRET, MINIO_SECURE, MINIO_URL

from .storage_service_interface import StorageServiceInterface


class MinioServiceInterface(StorageServiceInterface):
    def __init__(
        self,
        minio_url: str = MINIO_URL,
        minio_key: str = MINIO_KEY,
        minio_secret: str = MINIO_SECRET,
        minio_secure: bool = MINIO_SECURE,
        client=None,
    ):
        if client is None:
            client = self.init_client(minio_url, minio_key, minio_secret, minio_secure)
        self.client = client

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
            raise HTTPException(status_code=404, detail=f"Bucket with name {bucket_name} not found")
        self.client.remove_bucket(bucket_name)

    def list_objects(self, bucket_name: str) -> List[Item]:
        if not self.client.bucket_exists(bucket_name):
            raise HTTPException(status_code=404, detail=f"Bucket with name {bucket_name} not found")
        objects: List[Object] = self.client.list_objects(bucket_name)
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
