import base64
import json
from io import BytesIO
from typing import List

from fastapi.responses import RedirectResponse

from build.openapi_server.models.databag import Databag
from build.openapi_server.models.item import Item
from build.openapi_server.models.json_response import JsonResponse
from services import STORAGE_BACKEND
from services.databag_service import DatabagService
from services.init_storage_service import storage_services
from services.storage_service_interface import StorageService


class ObjectstoreApiService:
    def __init__(
        self,
        storage_service=None,
    ):
        self.storage_service: StorageService = (
            storage_service
            if storage_service is not None
            else storage_services[STORAGE_BACKEND]()
        )
        self.databag_service: DatabagService = DatabagService(
            self.storage_service
        )

    def delete_object_by_name(self, bucket_name, object_name) -> None:
        return self.storage_service.delete_item(
            bucket_name=bucket_name, object_name=object_name
        )

    def get_objects(self, bucket_name, path_prefix) -> List[Item]:
        # can be removed after issue #289 is solved
        if not path_prefix:
            path_prefix = ""
        return self.storage_service.list_items(
            bucket_name=bucket_name, path_prefix=path_prefix
        )

    def get_object_by_name(self, bucket_name, object_name) -> RedirectResponse:
        url = self.storage_service.get_presigned_get_url(
            bucket_name=bucket_name, object_name=object_name
        )
        return RedirectResponse(url)

    def get_json_object_by_name(
        self, bucket_name: str, object_name: str
    ) -> JsonResponse:
        json_data = self.storage_service.get_json_object_from_bucket(
            bucket_name, object_name
        )
        json_str = json.dumps(json_data)
        encoded_json_str = base64.encodebytes(json_str.encode()).decode()
        return JsonResponse(json_content=encoded_json_str)

    def get_object_url(self, bucket_name, object_name) -> str:
        return self.storage_service.get_presigned_get_url(
            bucket_name=bucket_name, object_name=object_name
        )

    def get_presigned_put_url(self, bucket_name, object_name) -> str:
        return self.storage_service.get_presigned_put_url(
            bucket_name=bucket_name, object_name=object_name
        )

    def put_object_by_name(self, bucket_name, object_name, body) -> Item:
        file_content: bytes = body
        file: BytesIO = BytesIO(file_content)
        return self.storage_service.create_item(
            bucket_name=bucket_name,
            object_name=object_name,
            data=file,
            size=len(file_content),
            content_type="application/octet-stream",
        )

    def delete_bucket(self, bucket_name) -> None:
        return self.storage_service.delete_bucket(bucket_name=bucket_name)

    def post_new_bucket(self, bucket_name) -> str:
        return self.storage_service.create_bucket(bucket_name=bucket_name)

    def get_all_buckets(self):
        return self.storage_service.list_buckets()

    def delete_objects(self, bucket_name: str, path_prefix: str):
        # can be removed after issue #289 is solved
        if not path_prefix:
            path_prefix = ""
        return self.storage_service.delete_items(
            bucket_name=bucket_name, path_prefix=path_prefix
        )

    def get_databag_by_run_id(self, run_id) -> Databag:
        for databag in self.databag_service.get_databags():
            if databag.run_id == run_id:
                return databag
