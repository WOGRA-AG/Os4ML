import json
from datetime import datetime, timedelta
from typing import List

from minio import Minio
from minio.datatypes import Bucket, Object
from urllib3 import HTTPResponse, PoolManager

from build.openapi_server.models.databag import Databag
from services import DATABAG_CONFIG_FILE_NAME


class MinioMock(Minio):
    @property
    def _http(self):
        return PoolManager()

    def __init__(
        self,
        endpoint: str = "",
        access_key: str = "",
        secret_key: str = "",
        secure: bool = False,
    ):
        pass

    def list_buckets(self) -> List[Bucket]:
        return [
            Bucket(name="test", creation_date=datetime.utcnow()),
            Bucket(name="os4ml", creation_date=datetime.utcnow()),
            Bucket(name="os6ml", creation_date=datetime.utcnow()),
            Bucket(name="templates", creation_date=datetime.utcnow()),
        ]

    def make_bucket(
        self, bucket_name: str, location=None, object_lock=False
    ) -> None:
        if "_" in bucket_name:
            raise ValueError()
        return

    def bucket_exists(self, bucket_name) -> bool:
        return (
            len(
                list(
                    filter(
                        lambda x: x.name == bucket_name, self.list_buckets()
                    )
                )
            )
            > 0
        )

    def remove_bucket(self, bucket_name) -> None:
        return

    def list_objects(
        self,
        bucket_name,
        prefix=None,
        recursive=False,
        start_after=None,
        include_user_meta=False,
        include_version=False,
        use_api_v1=False,
        use_url_encoding_type=True,
    ) -> List[Object]:
        objects_list_os4ml = [
            Object(bucket_name="os4ml", object_name="object.csv"),
            Object(bucket_name="os4ml", object_name=DATABAG_CONFIG_FILE_NAME),
        ]
        objects_list_os6ml = [
            Object(bucket_name="os6ml", object_name="test.txt")
        ]
        if bucket_name == "os4ml":
            return objects_list_os4ml
        if bucket_name == "os6ml":
            return objects_list_os6ml
        if bucket_name == "templates":
            return [
                Object(
                    bucket_name="templates",
                    object_name="components/component/metadata.json",
                ),
                Object(
                    bucket_name="templates",
                    object_name="components/component/component.yaml",
                ),
                Object(
                    bucket_name="templates",
                    object_name="pipelines/pipeline/metadata.json",
                ),
                Object(
                    bucket_name="templates",
                    object_name="pipelines/pipeline/pipeline.yaml",
                ),
            ]
        return []

    def get_presigned_url(
        self,
        method,
        bucket_name,
        object_name,
        expires=timedelta(days=7),
        response_headers=None,
        request_date=None,
        version_id=None,
        extra_query_params=None,
    ) -> str:
        return "https://www.wogra.com"

    def remove_object(self, bucket_name, object_name, version_id=None) -> None:
        return

    def remove_objects(self, bucket_name, delete_object_list,
                       bypass_governance_mode=False) -> List:
        return []

    def put_object(
        self,
        bucket_name,
        object_name,
        data,
        length,
        content_type="application/octet-stream",
        metadata=None,
        sse=None,
        progress=None,
        part_size=0,
        num_parallel_uploads=3,
        tags=None,
        retention=None,
        legal_hold=False,
    ) -> None:
        return

    def fput_object(
        self,
        bucket_name,
        object_name,
        file_path,
        content_type="application/octet-stream",
        metadata=None,
        sse=None,
        progress=None,
        part_size=0,
        num_parallel_uploads=3,
        tags=None,
        retention=None,
        legal_hold=False,
    ) -> None:
        return

    def get_object(
        self,
        bucket_name: str,
        object_name,
        offset=0,
        length=0,
        request_headers=None,
        ssec=None,
        version_id=None,
        extra_query_params=None,
    ) -> HTTPResponse:
        return HTTPResponse(
            json.dumps(
                Databag(
                    bucket_name=bucket_name,
                    databag_name=bucket_name,
                    columns=[],
                ).dict()
            )
        )
