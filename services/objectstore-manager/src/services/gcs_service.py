import json
from datetime import timedelta
from io import BytesIO
from typing import Iterator, List, Optional

from fastapi import HTTPException
from google.cloud.storage import Blob
from google.cloud.storage import Bucket as GcpBucket
from google.cloud.storage import Client

from build.openapi_server.models.bucket import Bucket
from build.openapi_server.models.item import Item
from services.storage_service_interface import StorageService


class GcsService(StorageService):
    def __init__(
        self,
        client: Client,
    ):
        self.client = client
        self.gcs_timeout = 1

    def _get_gcp_bucket(self, bucket_name: str) -> GcpBucket:
        gcp_bucket = GcpBucket(self.client, name=bucket_name)
        if not gcp_bucket.exists(timeout=self.gcs_timeout):
            raise HTTPException(
                status_code=404,
                detail=f"Bucket with name {bucket_name} not found",
            )
        return gcp_bucket

    def get_bucket(self, bucket_name: str) -> Bucket:
        self._get_gcp_bucket(bucket_name)
        return Bucket(name=bucket_name)

    def get_item(self, bucket_name: str, object_name: str) -> Item:
        bucket = self._get_gcp_bucket(bucket_name)
        if not bucket.blob(object_name).exists(timeout=self.gcs_timeout):
            raise HTTPException(
                status_code=404,
                detail=f"Object with name {object_name} in Bucket {bucket_name} does not exist",
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
        bucket = self._get_gcp_bucket(bucket_name)
        blob: Blob = Blob(bucket=bucket, name=object_name)
        blob.upload_from_filename(
            file_name, content_type, timeout=self.gcs_timeout
        )
        return Item(bucket_name=bucket_name, object_name=object_name)

    def get_json_object_from_bucket(self, bucket_name, json_file_name) -> dict:
        bucket = self._get_gcp_bucket(bucket_name)
        blob: Blob = Blob(name=json_file_name, bucket=bucket)
        if not blob.exists(timeout=self.gcs_timeout):
            raise HTTPException(
                status_code=404,
                detail=f"Object with name {json_file_name} in Bucket {bucket_name} does not exist",
            )
        file_string: str = blob.download_as_text(timeout=self.gcs_timeout)
        return json.loads(file_string)

    def get_object_from_bucket(self, bucket_name, file_name) -> str:
        bucket = self._get_gcp_bucket(bucket_name)
        blob: Blob = Blob(bucket=bucket, name=file_name)
        if not blob.exists(timeout=self.gcs_timeout):
            raise HTTPException(
                status_code=404,
                detail=f"Object with name {file_name} in Bucket {bucket_name} does not exist",
            )
        return blob.download_as_text(timeout=self.gcs_timeout)

    def create_bucket(self, bucket_name: str) -> str:
        bucket: GcpBucket = GcpBucket(client=self.client, name=bucket_name)
        if bucket.exists(timeout=self.gcs_timeout):
            return bucket_name
        return self.client.create_bucket(
            bucket_name, location="europe-west4", timeout=self.gcs_timeout
        ).name

    def delete_bucket(self, bucket_name: str) -> None:
        bucket: GcpBucket = GcpBucket(client=self.client, name=bucket_name)
        if not bucket.exists(timeout=self.gcs_timeout):
            return
        bucket.delete(force=True, timeout=self.gcs_timeout)

    def list_items(self, bucket_name: str, path_prefix: str) -> List[Item]:
        bucket = self._get_gcp_bucket(bucket_name)
        blobs: Iterator[Blob] = bucket.list_blobs(
            timeout=self.gcs_timeout, prefix=path_prefix
        )
        return [
            Item(bucket_name=bucket_name, object_name=blob.name)
            for blob in blobs
        ]

    def delete_items(self, bucket_name: str, path_prefix: str) -> None:
        bucket = self._get_gcp_bucket(bucket_name)
        blobs: Iterator[Blob] = bucket.list_blobs(
            timeout=self.gcs_timeout, prefix=path_prefix
        )
        bucket.delete_blobs(list(blobs), timeout=self.gcs_timeout)

    def get_presigned_get_url(self, bucket_name: str, object_name: str) -> str:
        bucket = self._get_gcp_bucket(bucket_name)
        blob: Blob = Blob(bucket=bucket, name=object_name)
        if not blob.exists(timeout=self.gcs_timeout):
            raise HTTPException(
                status_code=404,
                detail=f"Object with name {object_name} in Bucket {bucket_name} does not exist",
            )
        return blob.generate_signed_url(
            expiration=timedelta(hours=1), method="GET"
        )

    def get_presigned_put_url(self, bucket_name: str, object_name: str) -> str:
        bucket = self._get_gcp_bucket(bucket_name)
        blob: Blob = Blob(bucket=bucket, name=object_name)
        if not blob.exists(timeout=self.gcs_timeout):
            raise HTTPException(
                status_code=404,
                detail=f"Object with name {object_name} in Bucket {bucket_name} does not exist",
            )
        return blob.generate_signed_url(
            expiration=timedelta(hours=1), method="PUT"
        )

    def delete_item(self, bucket_name: str, object_name: str) -> None:
        bucket: GcpBucket = GcpBucket(self.client, bucket_name)
        blob: Blob = Blob(bucket=bucket, name=object_name)
        self._delete_blob(blob)

    def _delete_blob(self, blob: Blob):
        if not blob.exists(timeout=self.gcs_timeout):
            return
        blob.delete(timeout=self.gcs_timeout)

    def create_item(
        self,
        bucket_name: str,
        object_name: str,
        data: BytesIO,
        size: int,
        content_type: str,
    ) -> None:
        bucket = self._get_gcp_bucket(bucket_name)
        bucket.blob(object_name).upload_from_file(
            data,
            size=size,
            content_type=content_type,
            timeout=self.gcs_timeout,
        )

    def list_buckets(self) -> List[Bucket]:
        buckets: List[GcpBucket] = self.client.list_buckets(
            timeout=self.gcs_timeout
        )
        return [Bucket(name=bucket.name) for bucket in buckets]
