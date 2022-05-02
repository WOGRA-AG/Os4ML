import json
from typing import List
from datetime import datetime
from uuid import UUID, uuid4

from fastapi import HTTPException
from openapi_client.api.objectstore_api import ObjectstoreApi
from openapi_client.model.databag import Databag

from models import RunParams, Solution
from src import SOLUTION_CONFIG_FILE_NAME

from .template_service import TemplateService


def _solution_file_name(solution_name: str):
    return f"{solution_name}/{SOLUTION_CONFIG_FILE_NAME}"


class SolutionService:
    def __init__(self, kfp_client=None):
        self.template_service = TemplateService(kfp_client=kfp_client)
        self.objectstore = ObjectstoreApi()

    def get_solution(self, solution_name: str) -> Solution:
        solutions_with_name = self._get_solutions_with_name(solution_name)
        if not solutions_with_name:
            raise HTTPException(
                status_code=404,
                detail=f"Solution with name {solution_name} not found",
            )
        return solutions_with_name.pop()

    def _get_solutions_with_name(self, solution_name: str) -> List[Solution]:
        all_solutions = self.objectstore.get_all_solutions()
        return [
            solution
            for solution in all_solutions
            if solution.name == solution_name
        ]

    def create_solution(self, solution: Solution) -> str:
        uuid: UUID = uuid4()
        solution.name = f"{uuid}_{solution.name}"
        solution.creation_time = datetime.utcnow().strftime(
            "%Y-%m-%dT%H:%M:%SZ"
        )
        databag: Databag = self.objectstore.get_databag_by_bucket_name(
            solution.bucket_name
        )
        run_params: RunParams = RunParams(
            bucket=databag.bucket_name, file_name=databag.file_name
        )
        self._persist_solution(solution)
        run_id: str = self.template_service.run_pipeline_template(
            solution.solver, run_params
        )
        solution.run_id = run_id
        self._persist_solution(solution)
        return run_id

    def update_solution(
        self, solution_name: str, solution: Solution
    ) -> Solution:
        if not solution.name == solution_name:
            self.delete_solution(solution_name)
        self._persist_solution(solution)
        return solution

    def delete_solution(self, solution_name: str) -> None:
        solutions_with_name = self._get_solutions_with_name(solution_name)
        if not solutions_with_name:
            return
        solution = solutions_with_name.pop()
        file_name = _solution_file_name(solution.name)
        self.objectstore.delete_object_by_name(
            bucket_name=solution.bucket_name, object_name=file_name
        )

    def _persist_solution(self, solution: Solution):
        file_name = _solution_file_name(solution.name)
        with open(f"/tmp/{SOLUTION_CONFIG_FILE_NAME}", "w") as file:
            json.dump(solution.dict(), file)
        with open(f"/tmp/{SOLUTION_CONFIG_FILE_NAME}", "r") as file:
            self.objectstore.put_object_by_name(
                bucket_name=solution.bucket_name,
                object_name=f"{file_name}",
                body=file,
            )
