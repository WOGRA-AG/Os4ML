import contextlib
import json
from io import BytesIO

from minio.deleteobjects import DeleteObject
from minio.error import S3Error
from urllib3 import HTTPResponse

from exceptions import BucketNotFoundException, ObjectNotFoundException
from repository.clients.minio_client import get_minio_client


class MinioRepository:
    def __init__(self):
        self.client = get_minio_client()

    def _check_if_bucket_exists(self, bucket_name: str) -> None:
        if not self.client.bucket_exists(bucket_name):
            raise BucketNotFoundException(bucket_name)

    def _check_if_object_exists(
        self, bucket_name: str, object_name: str
    ) -> None:
        try:
            self.client.stat_object(bucket_name, object_name)
        except S3Error as err:
            if err.code == "NoSuchKey":
                raise ObjectNotFoundException(bucket_name, object_name)

    @contextlib.contextmanager
    def _get_minio_object_context(self, bucket_name, file_name):
        response: HTTPResponse = self.client.get_object(bucket_name, file_name)
        try:
            yield response
        finally:
            response.close()
            response.release_conn()

    def create_object(
        self,
        bucket_name: str,
        object_name: str,
        data: BytesIO,
        size: int,
        content_type: str,
    ) -> str:
        self._check_if_bucket_exists(bucket_name)
        self.client.put_object(
            bucket_name, object_name, data, size, content_type
        )
        return object_name

    def delete_object(self, bucket_name: str, object_name: str) -> None:
        try:
            self._check_if_bucket_exists(bucket_name)
            self._check_if_object_exists(bucket_name, object_name)
            self.client.remove_object(bucket_name, object_name)
        except (BucketNotFoundException, ObjectNotFoundException):
            pass

    def list_objects(self, bucket_name: str, path_prefix: str) -> list[str]:
        self._check_if_bucket_exists(bucket_name)
        minio_objects = self.client.list_objects(
            bucket_name, recursive=True, prefix=path_prefix
        )
        return [minio_object.object_name for minio_object in minio_objects]

    def delete_objects(self, bucket_name: str, path_prefix: str) -> None:
        self._check_if_bucket_exists(bucket_name)
        objects = self.client.list_objects(
            bucket_name, recursive=True, prefix=path_prefix
        )
        delete_objects = (DeleteObject(obj.object_name) for obj in objects)
        errors = self.client.remove_objects(bucket_name, delete_objects)
        if errors:
            for error in errors:
                print(error)

    def get_json_object_from_bucket(self, bucket_name, object_name) -> dict:
        self._check_if_bucket_exists(bucket_name)
        self._check_if_object_exists(bucket_name, object_name)
        with self._get_minio_object_context(
            bucket_name, object_name
        ) as response:
            return json.loads(response.data)

    def get_presigned_get_url(self, bucket_name: str, object_name: str) -> str:
        self._check_if_bucket_exists(bucket_name)
        self._check_if_object_exists(bucket_name, object_name)
        return self.client.presigned_get_object(bucket_name, object_name)

    def get_presigned_put_url(self, bucket_name: str, object_name: str) -> str:
        self._check_if_bucket_exists(bucket_name)
        return self.client.presigned_put_object(bucket_name, object_name)
