import json
from contextlib import contextmanager
from io import BytesIO
from pathlib import PurePath
from typing import Generator, List

from fastapi import HTTPException
from minio import Minio
from minio.datatypes import Bucket as MinioBucket
from minio.datatypes import Object as MinioObject
from urllib3 import HTTPResponse

from src import (
    COMPONENT_FILE_NAME,
    DATABAG_CONFIG_FILE_NAME,
    MINIO_KEY,
    MINIO_SECRET,
    MINIO_SECURE,
    MINIO_URL,
    PIPELINE_FILE_NAME,
    TEMPLATE_METADATA_FILE_NAME,
)
from src.models import Bucket, Databag, Item, PipelineTemplate, Url

from .storage_service_interface import StorageServiceInterface


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
            client = self.init_client(minio_url, minio_key, minio_secret, minio_secure)
        self.client = client
        self.config_file_name = config_file_name
        self.metadata_file_name = metadata_file_name
        self.component_file_name = component_file_name
        self.pipeline_file_name = pipeline_file_name

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
        return self.client.presigned_get_object(bucket_name, object_name)

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

    @contextmanager
    def get_minio_object(self, bucket_name, file_name):
        response: HTTPResponse = self.client.get_object(bucket_name, file_name)
        try:
            yield response
        finally:
            response.close()
            response.release_conn()

    def get_databags(self) -> List[Databag]:
        buckets: List[Bucket] = self.get_buckets()
        databag_buckets: List[Bucket] = [bucket for bucket in buckets if self.bucket_is_databag(bucket.name)]
        databags: List[Databag] = []
        for db in databag_buckets:
            with self.get_minio_object(db.name, self.config_file_name) as response:
                databag: Databag = Databag(**json.loads(response.data))
                databags.append(databag)
        return databags

    def bucket_is_databag(self, bucket_name: str) -> bool:
        minio_objects: List[MinioObject] = self.client.list_objects(bucket_name)
        return self.object_list_has_file(minio_objects, self.config_file_name)

    def get_databag_by_bucket_name(self, bucket_name: str) -> Databag:
        if not self.client.bucket_exists(bucket_name):
            raise HTTPException(status_code=404, detail=f"Bucket with name {bucket_name} not found")
        if not self.bucket_is_databag(bucket_name):
            raise HTTPException(status_code=400, detail=f"Bucket with name {bucket_name} is not a databag")
        with self.get_minio_object(bucket_name, self.config_file_name) as response:
            return Databag(**json.loads(response.data))

    def put_databag_by_bucket_name(self, bucket_name: str, databag: Databag):
        if not self.client.bucket_exists(bucket_name):
            raise HTTPException(status_code=404, detail=f"Bucket with name {bucket_name} not found")
        with open(f"/tmp/{self.config_file_name}", "w") as file:
            json.dump(databag.dict(), file)
        self.client.fput_object(bucket_name, self.config_file_name, file.name)

    def get_all_pipeline_templates(self, temp_type: str) -> List[PipelineTemplate]:
        templates: List[PipelineTemplate] = []
        bucket_name: str = "templates"
        template_dirs = [
            path for path in self.get_directories(bucket_name, temp_type) if self.is_template_dir(f"{temp_type}/{path}")
        ]
        for template_dir in template_dirs:
            path: str = f"{temp_type}/{template_dir}"
            with self.get_minio_object(bucket_name, f"{path}/{self.metadata_file_name}") as response:
                template: PipelineTemplate = PipelineTemplate(**json.loads(response.data))
                template.file_url = self.get_presigned_get_url(bucket_name, f"{path}/{self.component_file_name}")
                template.type = (
                    "Component" if temp_type == "components" else "Pipeline" if temp_type == "pipelines" else ""
                )
                templates.append(template)
        return templates

    def get_directories(self, bucket_name: str, prefix: str = "") -> List[str]:
        minio_objects: Generator[MinioObject] = self.client.list_objects(bucket_name, prefix=prefix, recursive=True)
        directory_gen: Generator[str] = (minio_object.object_name.split("/") for minio_object in minio_objects)
        directory_gen = (i for i in directory_gen if len(i) > 1)
        directories: List[str] = []
        for path in directory_gen:
            path = path[1:-1] if prefix else path[:-1]
            current_path = ""
            for path_component in path:
                current_path = f"{current_path}/{path_component}" if current_path else path_component
                directories.append(current_path)
        return list(set(directories))

    def is_template_dir(self, path: str):
        minio_objects: List[MinioObject] = list(self.client.list_objects("templates", prefix=f"/{path}/"))
        return self.object_list_has_file(minio_objects, f"{path}/{self.metadata_file_name}") and (
            self.object_list_has_file(minio_objects, f"{path}/{self.pipeline_file_name}")
            or self.object_list_has_file(minio_objects, f"{path}/{self.component_file_name}")
        )

    def object_list_has_file(self, minio_objects: List[MinioObject], file_name: str) -> bool:
        file_list = [i for i in minio_objects if i.object_name == file_name]
        return len(file_list) > 0

    def get_pipeline_template_by_name(self, temp_type: str, template_name: str) -> PipelineTemplate:
        comp_list = [i for i in self.get_all_pipeline_templates(temp_type) if i.name == template_name]
        if len(comp_list) == 0:
            raise HTTPException(status_code=404, detail=f"Template with name {template_name} not found")
        return comp_list.pop()
