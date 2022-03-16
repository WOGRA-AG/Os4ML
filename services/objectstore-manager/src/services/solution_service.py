from typing import List
from models import Solution, Databag
from services import MinioService


class SolutionService:
    def __init__(self, minio_client=None):
        self.minio_service = MinioService(client=minio_client)

    def get_all_solutions(self) -> List[Solution]:
        databag_list: List[Databag] = self.minio_service.get_databags()
        # iterate all databags
        # look for folders starting with "solution_"
        # look for solution.json
        # return Solution list
        pass
