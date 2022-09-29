import json
from contextlib import suppress
from datetime import datetime
from typing import Dict, List

from build.openapi_client.api.jobmanager_api import JobmanagerApi
from build.openapi_server.models.databag import Databag
from build.openapi_server.models.item import Item
from exceptions.DatabagNotFoundException import DatabagNotFoundException
from repository.interface.storage_repository_interface import StorageRepository
from services import (
    COMPONENT_FILE_NAME,
    DATABAG_CONFIG_FILE_NAME,
    PIPELINE_FILE_NAME,
    TEMPLATE_METADATA_FILE_NAME,
)
from services.init_api_clients import init_jobmanager_api


class DatabagService:
    def __init__(
        self,
        storage_repository: StorageRepository,
        databag_config_file: str = DATABAG_CONFIG_FILE_NAME,
        metadata_file_name: str = TEMPLATE_METADATA_FILE_NAME,
        component_file_name: str = COMPONENT_FILE_NAME,
        pipeline_file_name: str = PIPELINE_FILE_NAME,
    ):
        self.storage = storage_repository
        self.config_file_name = databag_config_file
        self.metadata_file_name = metadata_file_name
        self.component_file_name = component_file_name
        self.pipeline_file_name = pipeline_file_name
        self.jobmanager = init_jobmanager_api()

    def get_databags(self, bucket_name: str) -> List[Databag]:
        items: List[Item] = self.storage.list_items(
            bucket_name=bucket_name, path_prefix=""
        )
        return [
            Databag(
                **self.storage.get_json_object_from_bucket(
                    bucket_name, item.object_name
                )
            )
            for item in items
            if self.config_file_name in item.object_name
        ]

    def get_databag_by_id(self, bucket_name: str, databag_id: str) -> Databag:
        try:
            bucket: Dict = self.storage.get_json_object_from_bucket(
                bucket_name, f"{databag_id}/{self.config_file_name}"
            )
            return Databag(**bucket)
        except Exception:
            raise DatabagNotFoundException(name=databag_id)

    def update_databag(
        self, bucket_name: str, databag_id: str, databag: Databag
    ) -> str:
        self._persist_databag(
            bucket_name=bucket_name,
            databag_id=databag_id,
            databag=databag,
        )
        return databag_id

    def _persist_databag(
        self, bucket_name: str, databag_id: str, databag: Databag
    ) -> Item:
        databag.creation_time = (
            databag.creation_time
            or datetime.utcnow().strftime("%Y-%m-%dT%H:%M:%SZ")
        )
        databag.databag_id = databag_id or databag.databag_id
        with open(f"/tmp/{self.config_file_name}", "w") as file:
            json.dump(databag.dict(), file)
        return self.storage.create_item_by_filename(
            bucket_name, f"{databag_id}/{self.config_file_name}", file.name
        )

    def get_databag_by_run_id(self, bucket_name: str, run_id: str) -> Databag:
        databags_by_runid = [
            databag
            for databag in self.get_databags(bucket_name=bucket_name)
            if databag.run_id == run_id
        ]
        if not databags_by_runid:
            raise DatabagNotFoundException(run_id=run_id)
        return databags_by_runid.pop()

    def delete_databag_by_id(self, bucket_name: str, databag_id: str) -> None:
        try:
            databag: Databag = self.get_databag_by_id(bucket_name, databag_id)
        except DatabagNotFoundException:
            return
        if run_id := databag.run_id:
            self.jobmanager.delete_run(run_id)
        self.storage.delete_items(
            bucket_name=bucket_name, path_prefix=databag_id
        )

    def create_databag(self, bucket_name, databag_id):
        databag: Databag = Databag(databag_id=databag_id)
        self._persist_databag(
            bucket_name=bucket_name,
            databag_id=databag_id,
            databag=databag,
        )
        return databag_id
