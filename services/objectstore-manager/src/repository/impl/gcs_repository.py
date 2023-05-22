import json
from datetime import timedelta
from io import BytesIO

from google.cloud.storage import Blob, Bucket
from icecream import ic

from exceptions import BucketNotFoundException, ObjectNotFoundException
from repository.clients.gcs_client import get_gcs_client


class GcsRepository:
    def __init__(
        self,
    ):
        ic()
        self.client = get_gcs_client()
        ic()
        self.gcs_timeout = 1
        self.url_expiration_hours = 1

    def _get_gcp_bucket(self, bucket_name: str) -> Bucket:
        ic()
        gcp_bucket = Bucket(self.client, name=bucket_name)
        ic()
        if not gcp_bucket.exists(timeout=self.gcs_timeout):
            raise BucketNotFoundException(bucket_name)
        ic()
        return gcp_bucket

    def _get_blob_from_bucket(self, bucket: Bucket, object_name: str) -> Blob:
        ic()
        blob = Blob(bucket=bucket, name=object_name)
        ic()
        if not blob.exists(timeout=self.gcs_timeout):
            raise ObjectNotFoundException(bucket.name, object_name)
        ic()
        return blob

    def create_object(
        self,
        bucket_name: str,
        object_name: str,
        data: BytesIO,
        size: int,
        content_type: str,
    ) -> str:
        bucket = self._get_gcp_bucket(bucket_name)
        bucket.blob(object_name).upload_from_file(
            data,
            size=size,
            content_type=content_type,
            timeout=self.gcs_timeout,
        )
        return object_name

    def delete_object(self, bucket_name: str, object_name: str) -> None:
        try:
            bucket = self._get_gcp_bucket(bucket_name)
            blob = self._get_blob_from_bucket(bucket, object_name)
            blob.delete(timeout=self.gcs_timeout)
        except (BucketNotFoundException, ObjectNotFoundException):
            pass

    def list_objects(self, bucket_name: str, path_prefix: str) -> list[str]:
        ic()
        bucket = self._get_gcp_bucket(bucket_name)
        ic()
        blobs = bucket.list_blobs(timeout=self.gcs_timeout, prefix=path_prefix)
        ic()
        return [blob.name for blob in blobs]

    def delete_objects(self, bucket_name: str, path_prefix: str) -> None:
        ic()
        bucket = self._get_gcp_bucket(bucket_name)
        ic()
        blobs = bucket.list_blobs(timeout=self.gcs_timeout, prefix=path_prefix)
        ic()
        bucket.delete_blobs(list(blobs), timeout=self.gcs_timeout)
        ic()

    def get_json_object_from_bucket(self, bucket_name, object_name) -> dict:
        ic()
        bucket = self._get_gcp_bucket(bucket_name)
        ic()
        blob = self._get_blob_from_bucket(bucket, object_name)
        ic()
        file_string = blob.download_as_text(timeout=self.gcs_timeout)
        ic()
        return json.loads(file_string)

    def get_presigned_get_url(self, bucket_name: str, object_name: str) -> str:
        ic()
        bucket = self._get_gcp_bucket(bucket_name)
        ic()
        blob = self._get_blob_from_bucket(bucket, object_name)
        ic()
        return blob.generate_signed_url(
            expiration=timedelta(hours=self.url_expiration_hours), method="GET"
        )

    def get_presigned_put_url(self, bucket_name: str, object_name: str) -> str:
        ic()
        content_type = "application/octet-stream"
        ic()
        bucket = self._get_gcp_bucket(bucket_name)
        ic()
        blob = Blob(bucket=bucket, name=object_name)
        ic()
        return blob.generate_signed_url(
            expiration=timedelta(hours=self.url_expiration_hours),
            method="PUT",
            content_type=content_type,
        )
