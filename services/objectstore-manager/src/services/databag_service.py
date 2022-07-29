import json
from datetime import datetime
from typing import Dict, List

from fastapi import HTTPException

from build.openapi_server.models.bucket import Bucket
from build.openapi_server.models.databag import Databag
from build.openapi_server.models.item import Item
from repository.interface.storage_service_interface import StorageService
from services import (
    COMPONENT_FILE_NAME,
    DATABAG_CONFIG_FILE_NAME,
    PIPELINE_FILE_NAME,
    TEMPLATE_METADATA_FILE_NAME,
)


class DatabagService:
    def __init__(
        self,
        storage_service: StorageService,
        config_file_name: str = DATABAG_CONFIG_FILE_NAME,
        metadata_file_name: str = TEMPLATE_METADATA_FILE_NAME,
        component_file_name: str = COMPONENT_FILE_NAME,
        pipeline_file_name: str = PIPELINE_FILE_NAME,
    ):
        self.storage = storage_service
        self.config_file_name = config_file_name
        self.metadata_file_name = metadata_file_name
        self.component_file_name = component_file_name
        self.pipeline_file_name = pipeline_file_name

    def get_databags(self) -> List[Databag]:
        buckets: List[Bucket] = self.storage.list_buckets()
        databag_buckets: List[Bucket] = [
            bucket for bucket in buckets if self.bucket_is_databag(bucket.name)
        ]
        databags: List[Databag] = []
        for db in databag_buckets:
            databag: Databag = Databag(
                **self.storage.get_json_object_from_bucket(
                    db.name, self.config_file_name
                )
            )
            databags.append(databag)
        return databags

    def bucket_is_databag(self, bucket_name: str) -> bool:
        try:
            self.storage.get_item(bucket_name, self.config_file_name)
            return True
        except HTTPException:
            return False

    def get_databag_by_bucket_name(self, bucket_name: str) -> Databag:
        bucket: Dict = self.storage.get_json_object_from_bucket(
            bucket_name, self.config_file_name
        )
        return Databag(**bucket)

    def put_databag_by_bucket_name(self, bucket_name: str, databag: Databag):
        databag.creation_time = datetime.utcnow().strftime(
            "%Y-%m-%dT%H:%M:%SZ"
        )
        with open(f"/tmp/{self.config_file_name}", "w") as file:
            json.dump(databag.dict(), file)
        self.storage.create_item_by_filename(
            bucket_name, self.config_file_name, file.name
        )

    def object_list_has_file(self, items: List[Item], file_name: str) -> bool:
        file_list = [i for i in items if i.object_name == file_name]
        return len(file_list) > 0
