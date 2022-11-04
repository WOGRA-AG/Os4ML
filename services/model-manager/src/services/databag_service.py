import json
from datetime import datetime
from io import StringIO

from fastapi import Depends

from build.objectstore_client.api.objectstore_api import ObjectstoreApi
from build.openapi_server.models.databag import Databag
from exceptions import DatabagNotFoundException
from services import DATABAG_CONFIG_FILE_NAME, DATE_FORMAT_STR
from services.init_api_clients import init_objectstore_api


class DatabagService:

    def __init__(self, objectstore: ObjectstoreApi = Depends(init_objectstore_api)):
        self.objectstore = objectstore
        self.databag_config_file_name = DATABAG_CONFIG_FILE_NAME  # TODO as parameter without showing up in swagger ui?

    def list_databags(self, usertoken: str) -> list[Databag]:
        items: list[str] = self.objectstore.get_objects_with_prefix(path_prefix="", usertoken=usertoken)
        print(items)
        return [
            Databag(
                **self.objectstore.get_json_object_by_name(item)
            )
            for item in items
            if self.databag_config_file_name in item
        ]

    def get_databag_by_id(self, databag_id: str, usertoken: str) -> Databag:
        try:
            return Databag(
                **self.objectstore.get_json_object_by_name(databag_id, usertoken=usertoken)
            )
        except Exception:
            raise DatabagNotFoundException(databag_id)

    def create_databag(self, databag_id: str, usertoken: str) -> Databag:
        databag = Databag(databag_id=databag_id)
        databag.creation_time = datetime.utcnow().strftime(DATE_FORMAT_STR)
        self._save_databag_file(databag, usertoken)
        return databag

    def update_databag(self, databag: Databag, usertoken: str) -> None:
        self._save_databag_file(databag, usertoken)

    def delete_databag_by_id(self, databag_id: str, usertoken: str) -> None:
        try:
            self.get_databag_by_id(databag_id, usertoken)
        except DatabagNotFoundException:
            return
        # TODO cancel run
        self.objectstore.delete_objects_with_prefix(path_prefix=databag_id, usertoken=usertoken)

    def upload_dataset(self, databag_id: str, body: bytes, usertoken: str) -> None:
        databag = self.get_databag_by_id(databag_id, usertoken)
        self.objectstore.put_object_by_name(databag.file_name, body=body, usertoken=usertoken)

    def _save_databag_file(self, databag: Databag, usertoken: str):
        object_name = f"{databag.databag_id}/{self.databag_config_file_name}"
        data = StringIO()
        json.dump(databag.dict(), data)
        self.objectstore.put_object_by_name(object_name, body=data, usertoken=usertoken)
