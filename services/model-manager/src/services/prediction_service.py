from typing import Any

from fastapi import Depends

from build.job_manager_client.apis import JobmanagerApi
from build.job_manager_client.model.run_params import RunParams
from build.objectstore_client.apis import ObjectstoreApi
from build.objectstore_client.exceptions import NotFoundException
from build.openapi_server.models.prediction import Prediction
from build.openapi_server.models.solution import Solution
from exceptions import (
    PredictionDataFileNameNotSpecifiedException,
    PredictionDataNotFoundException,
    PredictionResultNotFoundException,
)
from services import (
    PREDICTION_CONFIG_FILE_NAME,
    PREDICTION_MESSAGE_CHANNEL,
    PREDICTION_RESULT_FILE_NAME,
)
from services.databag_service import DatabagService
from services.init_api_clients import init_jobmanager_api, init_objectstore_api
from services.messaging_service import MessagingService
from services.model_service import ModelService
from services.solution_service import SolutionService


class PredictionSerivce(ModelService[Prediction]):  # type: ignore
    messaging_service = MessagingService(PREDICTION_MESSAGE_CHANNEL)
    model_name = "Prediction"
    config_file_name = PREDICTION_CONFIG_FILE_NAME
    result_file_name = PREDICTION_RESULT_FILE_NAME
    prediction_pipeline = "prediction"

    def __init__(
        self,
        databag_service: DatabagService = Depends(),
        solution_service: SolutionService = Depends(),
        objectstore: ObjectstoreApi = Depends(init_objectstore_api),
        jobmanager: JobmanagerApi = Depends(init_jobmanager_api),
    ):
        super().__init__(objectstore, jobmanager)
        self.databag_service = databag_service
        self.solution_service = solution_service

    def get_file_name(
        self,
        prediction: Prediction,
        file_name: str,
        usertoken: str = "",
        solution: Solution | None = None,
    ) -> str:
        if solution is None:
            solution = self.solution_service.get_solution_by_id(
                prediction.solution_id, usertoken=usertoken
            )
        return (
            f"{solution.databag_id}/{solution.id}/{prediction.id}/{file_name}"
        )

    def build_model(self, dict_: dict[str, Any]) -> Prediction:
        return Prediction(**dict_)

    def create_run_params(self, prediction: Prediction) -> RunParams:
        return RunParams(prediction_id=prediction.id)

    def create_prediction(
        self, prediction: Prediction, usertoken: str
    ) -> Prediction:
        return self.create_model(
            prediction,
            self.prediction_pipeline,
            usertoken=usertoken,
        )

    def start_prediction_pipeline(
        self, id_: str, usertoken: str
    ) -> Prediction:
        prediction = self.get_prediction_by_id(id_, usertoken=usertoken)
        run_params = self.create_run_params(prediction)
        prediction.run_id = self.jobmanager.create_run_by_solver_name(
            self.prediction_pipeline,
            run_params=run_params,
            usertoken=usertoken,
        )
        self._persist_model(prediction, usertoken=usertoken)
        self._notify_model_update(usertoken)
        return prediction

    def get_prediction_data_get_url(self, id_: str, usertoken: str) -> str:
        prediction = self.get_prediction_by_id(id_, usertoken=usertoken)
        if prediction.data_url:
            return prediction.data_url  # type: ignore
        if not prediction.data_file_name:
            raise PredictionDataFileNameNotSpecifiedException()
        try:
            return self.get_presigned_get_url(  # type: ignore
                prediction, prediction.data_file_name, usertoken=usertoken
            )
        except NotFoundException:
            raise PredictionDataNotFoundException()

    def create_prediction_data_put_url(self, id_: str, usertoken: str) -> str:
        prediction = self.get_prediction_by_id(id_, usertoken=usertoken)
        if not prediction.data_file_name:
            raise PredictionDataFileNameNotSpecifiedException()
        file_name = self.get_file_name(
            prediction,
            prediction.data_file_name,
            usertoken=usertoken,
        )
        return self.objectstore.get_presigned_put_url(  # type: ignore
            file_name, usertoken=usertoken
        )

    def get_prediction_result_get_url(self, id_: str, usertoken: str) -> str:
        prediction = self.get_prediction_by_id(id_, usertoken=usertoken)
        try:
            return self.get_presigned_get_url(  # type: ignore
                prediction, self.result_file_name, usertoken=usertoken
            )
        except NotFoundException:
            raise PredictionResultNotFoundException()

    def create_prediction_result_put_url(
        self, id_: str, usertoken: str
    ) -> str:
        return self.get_presigned_put_url(  # type: ignore
            id_, self.result_file_name, usertoken=usertoken
        )

    get_predictions = ModelService.get_models
    get_prediction_by_id = ModelService.get_model_by_id
    update_prediction_by_id = ModelService.update_model_by_id
    delete_prediction_by_id = ModelService.delete_model_by_id
    stream_predictions = ModelService.stream_models
    terminate_predictions_stream = ModelService.terminate_model_stream
