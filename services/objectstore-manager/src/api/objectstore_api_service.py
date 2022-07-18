from io import BytesIO
from typing import List

from fastapi.responses import RedirectResponse

from build.openapi_server.models.bucket import Bucket
from build.openapi_server.models.item import Item
from build.openapi_server.models.solution import Solution
from services import STORAGE_BACKEND
from services.init_storage_service import storage_services
from services.solution_service import SolutionService
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
        self.solution_service: SolutionService = (
            SolutionService(storage_service)
            if storage_service is not None
            else SolutionService(storage_services[STORAGE_BACKEND]())
        )

    def delete_object_by_name(self, bucket_name, object_name) -> None:
        return self.storage_service.delete_item(
            bucket_name=bucket_name, object_name=object_name
        )

    def get_all_objects(self, bucket_name) -> List[Item]:
        return self.storage_service.list_items(bucket_name=bucket_name)

    def get_object_by_name(self, bucket_name, object_name) -> RedirectResponse:
        url = self.storage_service.get_presigned_get_url(
            bucket_name=bucket_name, object_name=object_name
        )
        return RedirectResponse(url)

    def get_json_object_by_name(self, bucket_name: str, object_name: str) -> dict:
        return self.storage_service.get_json_object_from_bucket(bucket_name, object_name)

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

    def post_new_bucket(self, bucket_name) -> Bucket:
        return self.storage_service.create_bucket(bucket_name=bucket_name)

    def get_all_solutions(self) -> List[Solution]:
        return self.solution_service.get_all_solutions()

    def get_all_buckets(self):
        return self.storage_service.list_buckets()
