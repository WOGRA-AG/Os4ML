from typing import List

from build.openapi_server.models.databag import Databag
from services import STORAGE_BACKEND
from services.databag_service import DatabagService
from services.init_storage_service import storage_services


class DatabagApiService:
    def __init__(self, storage_service=None):
        self.databag_service: DatabagService = (
            DatabagService(storage_service)
            if storage_service is not None
            else DatabagService(storage_services[STORAGE_BACKEND]())
        )

    def get_all_databags(self) -> List[Databag]:
        return self.databag_service.get_databags()

    def get_databag_by_bucket_name(self, bucket_name: str) -> Databag:
        return self.databag_service.get_databag_by_bucket_name(
            bucket_name=bucket_name
        )

    def put_databag_by_bucket_name(
        self, bucket_name: str, databag: Databag
    ) -> None:
        return self.databag_service.put_databag_by_bucket_name(
            bucket_name=bucket_name, databag=databag
        )

    def get_databag_by_run_id(self, run_id) -> Databag:
        for databag in self.databag_service.get_databags():
            if databag.run_id == run_id:
                return databag
