import base64
import itertools
import json
from datetime import datetime
from io import BytesIO
from typing import List
from uuid import UUID, uuid4

from fastapi import HTTPException

from build.openapi_client.model.bucket import Bucket
from build.openapi_client.model.databag import Databag
from build.openapi_client.model.item import Item
from build.openapi_client.model.json_response import JsonResponse
from build.openapi_server.models.run_params import RunParams
from build.openapi_server.models.solution import Solution
from services import DATE_FORMAT, SOLUTION_CONFIG_FILE_NAME
from services.init_api_clients import init_objectstore_api
from services.template_service import TemplateService


def _solution_file_name(solution_name: str):
    return f"{solution_name}/{SOLUTION_CONFIG_FILE_NAME}"


class SolutionService:
    def __init__(self, kfp_client=None):
        self.template_service = TemplateService(kfp_client=kfp_client)
        self.objectstore = init_objectstore_api()

    def get_all_solutions(self) -> List[Solution]:
        buckets = self.objectstore.get_all_buckets()
        all_solutions: List[List[Solution]] = [
            self.get_solutions_from_bucket(bucket) for bucket in buckets
        ]
        return list(itertools.chain(*all_solutions))

    def get_solutions_from_bucket(self, bucket: Bucket) -> List[Solution]:
        items: List[Item] = self.objectstore.get_all_objects(bucket.name)
        return [
            self._create_solution_from_item(item)
            for item in items
            if SOLUTION_CONFIG_FILE_NAME in item.object_name
        ]

    def _create_solution_from_item(self, item: Item) -> Solution:
        json_response: JsonResponse = self.objectstore.get_json_object_by_name(
            item.bucket_name, item.object_name
        )
        json_content_bytes = json_response.json_content.encode()
        json_str = base64.decodebytes(json_content_bytes)
        json_dict = json.loads(json_str)
        return Solution(**json_dict)

    def get_solution(self, solution_name: str) -> Solution:
        solutions_with_name = [
            solution
            for solution in self.get_all_solutions()
            if solution.name == solution_name
        ]
        if not solutions_with_name:
            raise HTTPException(
                status_code=404,
                detail=f"Solution with name {solution_name} not found",
            )
        return solutions_with_name.pop()

    def create_solution(self, solution: Solution) -> str:
        uuid: UUID = uuid4()
        solution.name = f"{uuid}_{solution.name}"
        solution.creation_time = datetime.utcnow().strftime(DATE_FORMAT)
        databag: Databag = self.objectstore.get_databag_by_bucket_name(
            solution.bucket_name
        )
        run_params: RunParams = RunParams(
            bucket=databag.bucket_name,
            file_name=databag.file_name,
            solution_name=solution.name,
        )
        self._persist_solution(solution)
        run_id: str = self.template_service.run_pipeline_template(
            solution.solver, run_params
        )
        solution.run_id = run_id
        self._persist_solution(solution)
        return run_id

    def put_solution(self, solution_name: str, solution: Solution) -> Solution:
        self._persist_solution(solution)
        return solution

    def _persist_solution(self, solution: Solution):
        encoded_solution = BytesIO(json.dumps(solution.dict()).encode())
        self.objectstore.put_object_by_name(
            bucket_name=solution.bucket_name,
            object_name=_solution_file_name(solution.name),
            body=encoded_solution,
        )

    def delete_solution(self, solution_name: str) -> None:
        solution = self.get_solution(solution_name)
        # TODO stop pipeline if still running
        self.objectstore.delete_object_by_name(
            solution.bucket_name,
            f"{solution.name}/{SOLUTION_CONFIG_FILE_NAME}",
        )
