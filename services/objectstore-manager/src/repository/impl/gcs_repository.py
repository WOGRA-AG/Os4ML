import json
from collections.abc import Iterable
from datetime import timedelta
from io import BytesIO

from google.cloud.storage import Blob, Bucket, Client

from exceptions import BucketNotFoundException, ObjectNotFoundException
from lib.singleton_decorator import singleton


@singleton
def init_gcs_client() -> Iterable[Client]:
    yield Client()


class GcsRepository:
    def __init__(
        self,
        client: Client = init_gcs_client,
    ):
        self.client = client
        self.gcs_timeout = 1
        self.url_expiration_hours = 1

    def _get_gcp_bucket(self, bucket_name: str) -> Bucket:
        gcp_bucket = Bucket(self.client, name=bucket_name)
        if not gcp_bucket.exists(timeout=self.gcs_timeout):
            raise BucketNotFoundException(bucket_name)
        return gcp_bucket

    def _get_blob_from_bucket(self, bucket: Bucket, object_name: str) -> Blob:
        blob = Blob(bucket=bucket, name=object_name)
        if not blob.exists(timeout=self.gcs_timeout):
            raise ObjectNotFoundException(bucket.name, object_name)
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
        bucket = self._get_gcp_bucket(bucket_name)
        blobs = bucket.list_blobs(timeout=self.gcs_timeout, prefix=path_prefix)
        return [blob.name for blob in blobs]

    def delete_objects(self, bucket_name: str, path_prefix: str) -> None:
        bucket = self._get_gcp_bucket(bucket_name)
        blobs = bucket.list_blobs(timeout=self.gcs_timeout, prefix=path_prefix)
        bucket.delete_blobs(list(blobs), timeout=self.gcs_timeout)

    def get_json_object_from_bucket(self, bucket_name, object_name) -> dict:
        bucket = self._get_gcp_bucket(bucket_name)
        blob = self._get_blob_from_bucket(bucket, object_name)
        file_string = blob.download_as_text(timeout=self.gcs_timeout)
        return json.loads(file_string)

    def get_presigned_get_url(self, bucket_name: str, object_name: str) -> str:
        bucket = self._get_gcp_bucket(bucket_name)
        blob = self._get_blob_from_bucket(bucket, object_name)
        return blob.generate_signed_url(
            expiration=timedelta(hours=self.url_expiration_hours), method="GET"
        )

    def get_presigned_put_url(self, bucket_name: str, object_name: str) -> str:
        bucket = self._get_gcp_bucket(bucket_name)
        blob = self._get_blob_from_bucket(bucket, object_name)
        return blob.generate_signed_url(
            expiration=timedelta(hours=self.url_expiration_hours), method="PUT"
        )
