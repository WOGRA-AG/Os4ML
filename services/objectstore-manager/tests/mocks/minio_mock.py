from typing import List

from minio.datatypes import Bucket, Object
from datetime import datetime, timedelta


class MinioMock:
    def __init__(self, endpoint: str = '', access_key: str = '', secret_key: str = '', secure: bool = False):
        pass

    def list_buckets(self) -> List[Bucket]:
        return [Bucket(name='test', creation_date=datetime.utcnow())]

    def make_bucket(self, bucket_name: str, location=None, object_lock=False) -> None:
        if '_' in bucket_name:
            raise ValueError()
        return

    def bucket_exists(self, bucket_name) -> bool:
        return bucket_name == 'os4ml'

    def remove_bucket(self, bucket_name) -> None:
        return

    def list_objects(self, bucket_name, prefix=None, recursive=False,
                     start_after=None, include_user_meta=False,
                     include_version=False, use_api_v1=False,
                     use_url_encoding_type=True) -> List[Object]:
        return [Object(bucket_name="os4ml", object_name="object")]

    def get_presigned_url(self, method, bucket_name, object_name,
                          expires=timedelta(days=7), response_headers=None,
                          request_date=None, version_id=None,
                          extra_query_params=None) -> str:
        return 'https://www.wogra.com'

    def remove_object(self, bucket_name, object_name, version_id=None) -> None:
        return
