import base64
import json
import logging
import uuid
from datetime import datetime
from io import BytesIO, StringIO

from fastapi import Depends

from build.job_manager_client import ApiException, ApiTypeError
from build.job_manager_client.api.jobmanager_api import JobmanagerApi
from build.job_manager_client.model.run import Run
from build.job_manager_client.model.run_params import RunParams
from build.objectstore_client.api.objectstore_api import ObjectstoreApi
from build.objectstore_client.model.json_response import JsonResponse
from build.openapi_server.models.databag import Databag
from exceptions import DatabagNotFoundException
from services import (
    DATABAG_CONFIG_FILE_NAME,
    DATAFRAME_FILE_NAME,
    DATE_FORMAT_STR,
)
from services.init_api_clients import init_jobmanager_api, init_objectstore_api


class DatabagService:
    def __init__(
        self,
        objectstore: ObjectstoreApi = Depends(init_objectstore_api),
        jobmanager: JobmanagerApi = Depends(init_jobmanager_api),
    ):
        self.objectstore = objectstore
        self.jobmanager = jobmanager
        self.databag_config_file_name = DATABAG_CONFIG_FILE_NAME
        self.dataframe_file_name = DATAFRAME_FILE_NAME

    def _get_databag_object_name(self, databag_id: str) -> str:
        return f"{databag_id}/{self.databag_config_file_name}"

    def list_databags(self, usertoken: str) -> list[Databag]:
        object_names: list[str] = self.objectstore.get_objects_with_prefix(
            path_prefix="", usertoken=usertoken
        )
        return [
            self._load_databag_from_object_name(
                object_name, usertoken=usertoken
            )
            for object_name in object_names
            if self.databag_config_file_name in object_name
        ]

    def _load_databag_from_object_name(
        self, object_name: str, usertoken: str
    ) -> Databag:
        json_response: JsonResponse = self.objectstore.get_json_object_by_name(
            object_name, usertoken=usertoken
        )
        json_content_bytes = json_response.json_content.encode()
        json_str = base64.decodebytes(json_content_bytes)
        json_dict = json.loads(json_str)
        return Databag(**json_dict)

    def get_databag_by_id(self, databag_id: str, usertoken: str) -> Databag:
        try:
            json_response: JsonResponse = (
                self.objectstore.get_json_object_by_name(
                    self._get_databag_object_name(databag_id),
                    usertoken=usertoken,
                )
            )
            json_content_bytes = json_response.json_content.encode()
            json_str = base64.decodebytes(json_content_bytes)
            json_dict = json.loads(json_str)
            return Databag(**json_dict)
        except Exception:
            raise DatabagNotFoundException(databag_id)

    def create_databag(self, databag: Databag, usertoken: str) -> Databag:
        databag.databag_id = str(uuid.uuid4())
        databag.creation_time = datetime.utcnow().strftime(DATE_FORMAT_STR)
        self._save_databag_file(databag, usertoken)
        run_params = RunParams(databag_id=databag.databag_id, solution_name="")
        run_id: str = self.jobmanager.create_run_by_solver_name(
            "databag", run_params=run_params, usertoken=usertoken
        )
        databag.run_id = run_id
        self._save_databag_file(databag, usertoken)
        return databag

    def update_databag(self, databag: Databag, usertoken: str) -> None:
        self._save_databag_file(databag, usertoken)

    def _save_databag_file(self, databag: Databag, usertoken: str) -> None:
        object_name = self._get_databag_object_name(databag.databag_id)
        json_str = json.dumps(databag.dict())
        data = StringIO(json_str)
        data.seek(0)
        self.objectstore.put_object_by_name(
            object_name, body=data, usertoken=usertoken
        )

    def delete_databag_by_id(self, databag_id: str, usertoken: str) -> None:
        try:
            databag: Databag = self.get_databag_by_id(databag_id, usertoken)
        except DatabagNotFoundException:
            return
        if databag.run_id is not None:
            try:
                run: Run = self.jobmanager.get_run_by_id(
                    databag.run_id, usertoken=usertoken
                )
                if run.status == "Running":
                    self.jobmanager.terminate_run_by_id(
                        databag.run_id, usertoken=usertoken
                    )
            except ApiException as e:
                logging.warning(e)
            except ApiTypeError as e:
                logging.error(e)
        self.objectstore.delete_objects_with_prefix(
            path_prefix=databag_id, usertoken=usertoken
        )

    def download_dataset(self, databag_id: str, usertoken: str) -> str:
        databag = self.get_databag_by_id(databag_id, usertoken)
        return self._get_presigned_get_url_for_databag_file(
            databag_id, databag.file_name, usertoken
        )

    def download_dataframe(self, databag_id: str, usertoken: str) -> str:
        return self._get_presigned_get_url_for_databag_file(
            databag_id, self.dataframe_file_name, usertoken
        )

    def _get_presigned_get_url_for_databag_file(
        self, databag_id: str, file_name: str, usertoken: str
    ) -> str:
        object_name = f"{databag_id}/{file_name}"
        return self.objectstore.get_presigned_get_url(  # type: ignore
            object_name, usertoken=usertoken
        )

    def upload_dataset(
        self, databag_id: str, body: bytes, usertoken: str
    ) -> None:
        databag = self.get_databag_by_id(databag_id, usertoken)
        self._upload_file_to_databag(
            databag, body, databag.file_name, usertoken
        )

    def upload_dataframe(
        self, databag_id: str, body: bytes, usertoken: str
    ) -> None:
        self.upload_file_to_databag(
            databag_id, body, self.dataframe_file_name, usertoken
        )

    def upload_file_to_databag(
        self, databag_id: str, body: bytes, file_name: str, usertoken: str
    ) -> None:
        databag = self.get_databag_by_id(databag_id, usertoken)
        self._upload_file_to_databag(databag, body, file_name, usertoken)

    def _upload_file_to_databag(
        self, databag: Databag, body: bytes, file_name: str, usertoken: str
    ) -> None:
        bytes_io = BytesIO(body)
        bytes_io.seek(0)
        object_name = f"{databag.databag_id}/{file_name}"
        self.objectstore.put_object_by_name(
            object_name, body=bytes_io, usertoken=usertoken
        )
