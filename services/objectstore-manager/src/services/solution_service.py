import json
from typing import List

from minio.datatypes import Object

from models import Bucket, Solution
from services import MinioService
from src import SOLUTION_CONFIG_FILE_NAME


class SolutionService:
    def __init__(self, minio_client=None):
        self.minio_service = MinioService(client=minio_client)

    def get_all_solutions(self) -> List[Solution]:
        bucket_list: List[Bucket] = self.minio_service.get_buckets()
        all_solutions: List[List[Solution]] = [
            self.get_solutions_from_bucket(bucket) for bucket in bucket_list
        ]
        solution_list: List[Solution] = [
            item for sublist in all_solutions for item in sublist
        ]
        return solution_list

    def get_solutions_from_bucket(self, bucket: Bucket) -> List[Solution]:
        minio_objects: List[Object] = self.minio_service.client.list_objects(
            bucket_name=bucket.name, recursive=True
        )
        solution_list: List[Solution] = [
            Solution(
                **self.minio_service.get_dict_from_bucket(
                    i.bucket_name, i.object_name
                )
            )
            for i in minio_objects
            if SOLUTION_CONFIG_FILE_NAME in i.object_name
        ]
        return solution_list
