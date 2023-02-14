from fastapi import Depends

from build.openapi_server.models.solution import Solution
from services import PREDICTION_CONFIG_FILE_NAME, PREDICTION_MESSAGE_CHANNEL
from services.databag_service import DatabagService
from services.messaging_service import MessagingService
from services.model_service import ModelService
from services.solution_service import SolutionService


class PredictionSerivce(ModelService[Prediction]):
    messaging_service = MessagingService(PREDICTION_MESSAGE_CHANNEL)

    def __init__(
        self,
        databag_service: DatabagService = Depends(),
        solution_service: SolutionService = Depends(),
    ):
        self.databag_service = databag_service
        self.solution_service = solution_service
        self.config_file_name = PREDICTION_CONFIG_FILE_NAME

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
