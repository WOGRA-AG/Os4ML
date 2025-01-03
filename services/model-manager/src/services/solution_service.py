import base64
import json
import logging
import uuid
from datetime import datetime
from io import BytesIO
from typing import AsyncIterator

from fastapi import Depends

from src.build.job_manager_client import ApiException, ApiTypeError
from src.build.job_manager_client.api.jobmanager_api import JobmanagerApi
from src.build.job_manager_client.model.run import Run
from src.build.job_manager_client.model.run_params import RunParams
from src.build.objectstore_client.api.objectstore_api import ObjectstoreApi
from src.build.objectstore_client.exceptions import NotFoundException
from src.build.objectstore_client.model.json_response import JsonResponse
from src.build.openapi_server.models.metrics import Metrics
from src.build.openapi_server.models.solution import Solution
from src.exceptions import (
    ModelFileNotFoundException,
    PredictionTemplateFileNameNotSpecifiedException,
    PredictionTemplateNotFoundException,
    SolutionIdUpdateNotAllowedException,
    SolutionNotFoundException,
)
from src.services import (
    DATE_FORMAT_STR,
    MODEL_FILE_NAME,
    PREDICTION_TEMPLATE_FILE_NAME,
    SOLUTION_CONFIG_FILE_NAME,
    SOLUTION_MESSAGE_CHANNEL,
)
from src.services.auth_service import get_parsed_token
from src.services.databag_service import DatabagService
from src.services.messaging_service import MessagingService


class SolutionService:
    messaging_service = MessagingService(SOLUTION_MESSAGE_CHANNEL)

    def __init__(
        self,
        objectstore: ObjectstoreApi = Depends(),
        jobmanager: JobmanagerApi = Depends(),
        databag_service: DatabagService = Depends(),
    ):
        self.objectstore = objectstore
        self.jobmanager = jobmanager
        self.databag_service = databag_service
        self.solution_config_file_name = SOLUTION_CONFIG_FILE_NAME
        self.model_file_name = MODEL_FILE_NAME
        self.prediction_template_file_name = PREDICTION_TEMPLATE_FILE_NAME

    def _get_file_name(self, solution: Solution, file_name: str) -> str:
        return f"{solution.databag_id}/{solution.id}/{file_name}"

    def get_solutions(self, usertoken: str) -> list[Solution]:
        objects: list[str] = self.objectstore.get_objects_with_prefix(
            path_prefix="", usertoken=usertoken
        )
        return [
            self._load_solution_from_object(obj, usertoken)
            for obj in objects
            if self.solution_config_file_name in obj
        ]

    async def stream_solutions(
        self, usertoken: str, client_id: uuid.UUID
    ) -> AsyncIterator[list[Solution]]:
        user = get_parsed_token(usertoken)
        yield self.get_solutions(usertoken)
        while True:
            await self.messaging_service.wait(user.id, client_id)
            yield self.get_solutions(usertoken)

    def _notify_solution_update(self, usertoken: str) -> None:
        user = get_parsed_token(usertoken)
        self.messaging_service.publish(user.id)

    def terminate_solutions_stream(self, client_id: uuid.UUID) -> None:
        self.messaging_service.unsubscribe(client_id)

    def _load_solution_from_object(self, obj: str, usertoken: str) -> Solution:
        json_response: JsonResponse = self.objectstore.get_json_object_by_name(
            obj, usertoken=usertoken
        )
        json_content_bytes = json_response.json_content.encode()
        json_str = base64.decodebytes(json_content_bytes)
        json_dict = json.loads(json_str)
        metrics = json_dict.pop("metrics", None)
        solution = Solution(**json_dict)
        if metrics:
            solution.metrics = Metrics(**metrics)
        return solution

    def get_solution_by_id(self, id_: str, usertoken: str) -> Solution:
        solutions_with_id = [
            solution
            for solution in self.get_solutions(usertoken=usertoken)
            if solution.id == id_
        ]
        if not solutions_with_id:
            raise SolutionNotFoundException(id_)
        return solutions_with_id.pop()

    def create_solution(self, solution: Solution, usertoken: str) -> Solution:
        solution.id = str(uuid.uuid4())
        solution.creation_time = datetime.utcnow().strftime(DATE_FORMAT_STR)
        self._notify_solution_update(usertoken)
        self._persist_solution(solution, usertoken=usertoken)
        return solution

    def start_solution_pipeline(
        self, solution_id: str, usertoken: str
    ) -> Solution:
        solution = self.get_solution_by_id(solution_id, usertoken=usertoken)
        run_params = RunParams(solution_id=solution_id)
        solution.run_id = self.jobmanager.create_run_by_solver_name(
            solution.solver, run_params=run_params, usertoken=usertoken
        )
        self._persist_solution(solution, usertoken=usertoken)
        self._notify_solution_update(usertoken)
        return solution

    def _persist_solution(self, solution: Solution, usertoken: str) -> None:
        encoded_solution = BytesIO(json.dumps(solution.dict()).encode())
        object_name = self._get_file_name(
            solution, self.solution_config_file_name
        )
        self.objectstore.put_object_by_name(
            object_name=object_name,
            body=encoded_solution,
            usertoken=usertoken,
        )

    def update_solution_by_id(
        self, id_: str, solution: Solution, usertoken: str
    ) -> Solution:
        if id_ != solution.id:
            raise SolutionIdUpdateNotAllowedException()
        self._persist_solution(solution, usertoken=usertoken)
        self._notify_solution_update(usertoken)
        return solution

    def delete_solution_by_id(self, id_: str, usertoken: str) -> None:
        try:
            solution = self.get_solution_by_id(
                id_=id_,
                usertoken=usertoken,
            )
        except SolutionNotFoundException:
            return
        if solution.run_id is not None:
            try:
                run: Run = self.jobmanager.get_run_by_id(
                    solution.run_id, usertoken=usertoken
                )
                if run.status == "Running":
                    self.jobmanager.terminate_run_by_id(
                        solution.run_id, usertoken=usertoken
                    )
            except ApiException as e:
                logging.warning(e)
            except ApiTypeError as e:
                logging.error(e)
        self.objectstore.delete_objects_with_prefix(
            path_prefix=self._get_file_name(solution, ""),
            usertoken=usertoken,
        )
        self._notify_solution_update(usertoken)

    def get_model_get_url(self, solution_id: str, usertoken: str) -> str:
        try:
            return self._get_presigned_get_url_for_solution_file(
                solution_id, self.model_file_name, usertoken=usertoken
            )
        except NotFoundException:
            raise ModelFileNotFoundException()

    def create_model_put_url(self, solution_id: str, usertoken: str) -> str:
        return self._get_presigned_put_url_for_solution_file(
            solution_id, self.model_file_name, usertoken=usertoken
        )

    def get_prediction_template_get_url(
        self, solution_id: str, usertoken: str
    ) -> str:
        solution = self.get_solution_by_id(solution_id, usertoken=usertoken)
        if not solution.prediction_template_file_name:
            raise PredictionTemplateFileNameNotSpecifiedException()
        try:
            return self._get_presigned_get_url_for_solution_file(
                solution_id,
                solution.prediction_template_file_name,
                usertoken=usertoken,
            )
        except NotFoundException:
            raise PredictionTemplateNotFoundException()

    def create_prediction_template_put_url(
        self, solution_id: str, usertoken: str
    ) -> str:
        solution = self.get_solution_by_id(solution_id, usertoken=usertoken)
        if not solution.prediction_template_file_name:
            raise PredictionTemplateFileNameNotSpecifiedException()
        return self._get_presigned_put_url_for_solution_file(
            solution_id,
            solution.prediction_template_file_name,
            usertoken=usertoken,
        )

    def _get_presigned_get_url_for_solution_file(
        self, solution_id: str, file_name: str, usertoken: str
    ) -> str:
        solution = self.get_solution_by_id(
            id_=solution_id,
            usertoken=usertoken,
        )
        object_name = self._get_file_name(solution, file_name)
        return self.objectstore.get_presigned_get_url(  # type: ignore
            object_name, usertoken=usertoken
        )

    def _get_presigned_put_url_for_solution_file(
        self, solution_id: str, file_name: str, usertoken: str
    ) -> str:
        solution = self.get_solution_by_id(
            id_=solution_id,
            usertoken=usertoken,
        )
        object_name = self._get_file_name(solution, file_name)
        return self.objectstore.get_presigned_put_url(  # type: ignore
            object_name, usertoken=usertoken
        )
