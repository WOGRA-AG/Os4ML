from typing import Any

from fastapi import Depends

from build.job_manager_client.apis import JobmanagerApi
from build.job_manager_client.model.run_params import RunParams
from build.objectstore_client.apis import ObjectstoreApi
from build.openapi_server.models.prediction import Prediction
from build.openapi_server.models.solution import Solution
from services import PREDICTION_CONFIG_FILE_NAME, PREDICTION_MESSAGE_CHANNEL
from services.databag_service import DatabagService
from services.init_api_clients import init_jobmanager_api, init_objectstore_api
from services.messaging_service import MessagingService
from services.model_service import ModelService
from services.solution_service import SolutionService


class PredictionSerivce(ModelService[Prediction]):  # type: ignore
    messaging_service = MessagingService(PREDICTION_MESSAGE_CHANNEL)
    model_name = "Prediction"
    config_file_name = PREDICTION_CONFIG_FILE_NAME
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

    def create_prediction(
        self, prediction: Prediction, usertoken: str = ""
    ) -> Prediction:
        solution = self.solution_service.get_solution_by_id(
            prediction.solution_id, usertoken=usertoken
        )
        run_params = RunParams(
            databag_id=solution.databag_id, solution_id=prediction.solution_id
        )
        return self.create_model(
            prediction,
            self.prediction_pipeline,
            run_params,
            usertoken=usertoken,
        )

    get_predictions = ModelService.get_models
    get_prediction_by_id = ModelService.get_model_by_id
    update_prediction_by_id = ModelService.update_model_by_id
    delete_prediction_by_id = ModelService.delete_model_by_id
    stream_predictions = ModelService.stream_models
    terminate_predictions_stream = ModelService.terminate_model_stream
