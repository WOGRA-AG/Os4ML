from typing import List

from build.openapi_server.models.bucket import Bucket
from build.openapi_server.models.item import Item
from build.openapi_server.models.solution import Solution
from services import SOLUTION_CONFIG_FILE_NAME
from services.storage_service_interface import StorageService


class SolutionService:
    def __init__(self, storage_service: StorageService):
        self.storage = storage_service

    def get_all_solutions(self) -> List[Solution]:
        bucket_list: List[Bucket] = self.storage.list_buckets()
        all_solutions: List[List[Solution]] = [
            self.get_solutions_from_bucket(bucket) for bucket in bucket_list
        ]
        solution_list: List[Solution] = [
            item for sublist in all_solutions for item in sublist
        ]
        return solution_list

    def get_solutions_from_bucket(self, bucket: Bucket) -> List[Solution]:
        minio_objects: List[Item] = self.storage.list_items(
            bucket_name=bucket.name
        )
        solution_list: List[Solution] = [
            Solution(
                **self.storage.get_json_object_from_bucket(
                    i.bucket_name, i.object_name
                )
            )
            for i in minio_objects
            if SOLUTION_CONFIG_FILE_NAME in i.object_name
        ]
        return solution_list
