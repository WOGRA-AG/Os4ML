import base64
import json
import uuid
from datetime import datetime
from io import BytesIO

from fastapi import Depends

from build.job_manager_client.api.jobmanager_api import JobmanagerApi
from build.job_manager_client.model.run import Run
from build.job_manager_client.model.run_params import RunParams
from build.objectstore_client.api.objectstore_api import ObjectstoreApi
from build.objectstore_client.model.json_response import JsonResponse
from build.openapi_server.models.solution import Solution
from exceptions import SolutionNotFoundException
from services import (
    DATE_FORMAT_STR,
    MODEL_FILE_NAME,
    SOLUTION_CONFIG_FILE_NAME,
)
from services.databag_service import DatabagService
from services.init_api_clients import init_objectstore_api, init_jobmanager_api


def _solution_file_name(solution: Solution) -> str:
    return f"{_get_solution_prefix(solution)}{SOLUTION_CONFIG_FILE_NAME}"


def _get_solution_prefix(solution: Solution) -> str:
    return f"{solution.databag_id}/{solution.name.split('_').pop(0)}/"


class SolutionService:
    def __init__(
        self,
        objectstore: ObjectstoreApi = Depends(init_objectstore_api),
        jobmanager: JobmanagerApi = Depends(init_jobmanager_api),
        databag_service: DatabagService = Depends(),
    ):
        self.objectstore = objectstore
        self.jobmanager = jobmanager
        self.databag_service = databag_service
        self.solution_config_file_name = SOLUTION_CONFIG_FILE_NAME

    def get_solutions(self, usertoken: str) -> list[Solution]:
        objects: list[str] = self.objectstore.get_objects_with_prefix(
            path_prefix="", usertoken=usertoken
        )
        return [
            self._load_solution_from_object(obj, usertoken)
            for obj in objects
            if self.solution_config_file_name in obj
        ]

    def _load_solution_from_object(self, obj: str, usertoken: str) -> Solution:
        json_response: JsonResponse = self.objectstore.get_json_object_by_name(
            obj, usertoken=usertoken
        )
        json_content_bytes = json_response.json_content.encode()
        json_str = base64.decodebytes(json_content_bytes)
        json_dict = json.loads(json_str)
        return Solution(**json_dict)

    def get_solution_by_name(
        self, solution_name: str, usertoken: str
    ) -> Solution:
        # TODO more efficiently by directly looking for the solution.json file?
        solutions_with_name = [
            solution
            for solution in self.get_solutions(usertoken=usertoken)
            if solution.name == solution_name
        ]
        if not solutions_with_name:
            raise SolutionNotFoundException(solution_name)
        return solutions_with_name.pop()

    def create_solution(self, solution: Solution, usertoken: str) -> Solution:
        # TODO split into id and name field
        uuid_: uuid.UUID = uuid.uuid4()
        solution.name = f"{uuid_}_{solution.name}"
        solution.creation_time = datetime.utcnow().strftime(DATE_FORMAT_STR)
        databag = self.databag_service.get_databag_by_id(
            solution.databag_id, usertoken=usertoken
        )
        run_params = RunParams(
            databag_id=databag.databag_id,
            solution_name=solution.name,
        )
        self._persist_solution(solution, usertoken=usertoken)
        run_id: str = self.jobmanager.create_run_by_solver_name(solution.solver, run_params=run_params, usertoken=usertoken)
        solution.run_id = run_id
        self._persist_solution(solution, usertoken=usertoken)
        return solution

    def _persist_solution(self, solution: Solution, usertoken: str) -> None:
        encoded_solution = BytesIO(json.dumps(solution.dict()).encode())
        self.objectstore.put_object_by_name(
            object_name=_solution_file_name(solution),
            body=encoded_solution,
            usertoken=usertoken,
        )

    def update_solution_by_name(
        self, solution_name: str, solution: Solution, usertoken: str
    ) -> Solution:
        if solution_name != solution.name:
            raise NotImplementedError()
        self._persist_solution(solution, usertoken=usertoken)
        return solution

    def delete_solution_by_name(
        self, solution_name: str, usertoken: str
    ) -> None:
        try:
            solution = self.get_solution_by_name(
                solution_name=solution_name,
                usertoken=usertoken,
            )
        except SolutionNotFoundException:
            return
        run: Run = self.jobmanager.get_run_by_id(solution.run_id, usertoken=usertoken)
        if run.status == "Running":
            self.jobmanager.terminate_run_by_id(solution.run_id, usertoken=usertoken)
        self.objectstore.delete_objects_with_prefix(
            path_prefix=_get_solution_prefix(solution),
            usertoken=usertoken,
        )

    def get_download_link_for_model_of_solution(
        self, solution_name: str, usertoken: str
    ) -> str:
        solution = self.get_solution_by_name(
            solution_name=solution_name,
            usertoken=usertoken,
        )
        object_name = f"{_get_solution_prefix(solution)}{MODEL_FILE_NAME}"
        return self.objectstore.get_presigned_get_url(  # type: ignore
            object_name, usertoken=usertoken
        )
