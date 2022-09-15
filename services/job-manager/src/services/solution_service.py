import base64
import json
from datetime import datetime
from io import BytesIO
from typing import List
from uuid import UUID, uuid4

from fastapi import HTTPException

from build.openapi_client.model.databag import Databag
from build.openapi_client.model.item import Item
from build.openapi_client.model.json_response import JsonResponse
from build.openapi_server.models.run_params import RunParams
from build.openapi_server.models.solution import Solution
from executor.kfp_executor import KfpExecutor
from services import DATE_FORMAT, SOLUTION_CONFIG_FILE_NAME
from services.init_api_clients import init_objectstore_api
from services.template_service import TemplateService


def _solution_file_name(databag_id: str, solution_name: str):
    return f"{databag_id}/{solution_name.split('_').pop(0)}/{SOLUTION_CONFIG_FILE_NAME}"


class SolutionService:
    def __init__(self, kfp_client=None):
        self.template_service = TemplateService(kfp_client=kfp_client)
        self.objectstore = init_objectstore_api()
        self.kfp_service = KfpExecutor(client=kfp_client)
        self.solution_config_file = SOLUTION_CONFIG_FILE_NAME

    def get_all_solutions(self, bucket_name: str) -> List[Solution]:
        items: List[Item] = self.objectstore.get_objects(
            bucket_name=bucket_name
        )
        return [
            self._create_solution_from_item(item)
            for item in items
            if self.solution_config_file in item.object_name
        ]

    def _create_solution_from_item(self, item: Item) -> Solution:
        json_response: JsonResponse = self.objectstore.get_json_object_by_name(
            item.bucket_name, item.object_name
        )
        json_content_bytes = json_response.json_content.encode()
        json_str = base64.decodebytes(json_content_bytes)
        json_dict = json.loads(json_str)
        return Solution(**json_dict)

    def get_solution(self, bucket_name: str, solution_name: str) -> Solution:
        solutions_with_name = [
            solution
            for solution in self.get_all_solutions(bucket_name=bucket_name)
            if solution.name == solution_name
        ]
        if not solutions_with_name:
            raise HTTPException(
                status_code=404,
                detail=f"Solution with name {solution_name} not found",
            )
        return solutions_with_name.pop()

    def create_solution(self, bucket_name: str, solution: Solution) -> str:
        uuid: UUID = uuid4()
        solution.name = f"{uuid}_{solution.name}"
        solution.creation_time = datetime.utcnow().strftime(DATE_FORMAT)
        databag: Databag = self.objectstore.get_databag_by_id(
            solution.databag_id
        )
        run_params: RunParams = RunParams(
            bucket=bucket_name,
            databag_id=databag.databag_id,
            file_name=databag.file_name,
            solution_name=solution.name,
        )
        self._persist_solution(bucket_name, solution.name, solution)
        run_id: str = self.template_service.run_pipeline_template(
            solution.solver, run_params
        )
        solution.run_id = run_id
        self._persist_solution(bucket_name, solution.name, solution)
        return run_id

    def put_solution(
        self, bucket_name: str, solution_name: str, solution: Solution
    ) -> Solution:
        self._persist_solution(bucket_name, solution_name, solution)
        return solution

    def _persist_solution(
        self, bucket_name: str, solution_name: str, solution: Solution
    ):
        encoded_solution = BytesIO(json.dumps(solution.dict()).encode())
        self.objectstore.put_object_by_name(
            bucket_name=bucket_name,
            object_name=_solution_file_name(
                solution.databag_id, solution_name
            ),
            body=encoded_solution,
        )

    def delete_solution(self, bucket_name: str, solution_name: str) -> None:
        solution = self.get_solution(
            bucket_name=bucket_name, solution_name=solution_name
        )
        run = self.kfp_service.get_run(solution.run_id)
        if run.status == "Running":
            self.kfp_service.terminate_run(solution.run_id)
        self.objectstore.delete_objects(
            bucket_name=bucket_name,
            path_prefix=f"{solution.databag_id}/{solution.name.split('_').pop(0)}/",
        )
