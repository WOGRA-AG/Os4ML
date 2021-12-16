from typing import List

from models import Bucket, Item, Url


class StorageServiceInterface:
    def get_buckets(self) -> List[Bucket]:
        raise NotImplementedError()

    def create_bucket(self, bucket_name: str) -> Bucket:
        raise NotImplementedError()

    def delete_bucket(self, bucket_name: str) -> None:
        raise NotImplementedError()

    def list_objects(self, bucket_name: str) -> List[Item]:
        raise NotImplementedError()

    def get_presigned_get_url(self, bucket_name: str, object_name: str) -> str:
        raise NotImplementedError()

    def get_presigned_put_url(self, bucket_name: str, object_name: str) -> Url:
        raise NotImplementedError()

    def delete_object(self, bucket_name: str, object_name: str) -> None:
        raise NotImplementedError()
