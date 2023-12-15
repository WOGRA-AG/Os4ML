from fastapi import Depends

from src.build.openapi_server.models import user
from src.build.openapi_server.models.databag import Databag
from src.build.openapi_server.models.new_transfer_learning_model_dto import (
    NewTransferLearningModelDto,
)
from src.build.openapi_server.models.prediction import Prediction
from src.build.openapi_server.models.solution import Solution
from src.build.openapi_server.models.solver import Solver
from src.build.openapi_server.models.transfer_learning_model import (
    TransferLearningModel,
)
from src.build.openapi_server.models.user_id_object import UserIdObject
from src.services.databag_service import DatabagService
from src.services.prediction_service import PredictionSerivce
from src.services.solution_service import SolutionService
from src.services.solver_service import SolverService
from src.services.transfer_learning_service import TransferLearningService


class ModelmanagerApiController:
    def __init__(
        self,
        solver_service: SolverService = Depends(),
        databag_service: DatabagService = Depends(),
        solution_service: SolutionService = Depends(),
        prediction_service: PredictionSerivce = Depends(),
        transfer_learning_service: TransferLearningService = Depends(),
    ):
        self.solver_service = solver_service
        self.databag_service = databag_service
        self.solution_service = solution_service
        self.prediction_service = prediction_service
        self.transfer_learning_service = transfer_learning_service

    # ----- solvers -----
    def get_solvers(self, usertoken: str = "") -> list[Solver]:
        return self.solver_service.list_solvers()  # type: ignore

    def get_solver_by_name(
        self, solver_name: str, usertoken: str = ""
    ) -> Solver:
        return self.solver_service.get_solver_by_name(solver_name)

    # ----- databags -----
    def get_databags(self, usertoken: str = "") -> list[Databag]:
        if usertoken is None:
            usertoken = ""
        return self.databag_service.get_databags(usertoken)  # type: ignore

    def create_databag(self, databag: Databag, usertoken: str = "") -> Databag:
        return self.databag_service.create_databag(databag, usertoken)

    def get_databag_by_id(
        self, databag_id: str, usertoken: str = ""
    ) -> Databag:
        return self.databag_service.get_databag_by_id(databag_id, usertoken)

    def update_databag_by_id(
        self, databag_id: str, databag: Databag, usertoken: str = ""
    ) -> Databag:
        return self.databag_service.update_databag(
            databag_id, databag, usertoken
        )

    def delete_databag_by_id(
        self, databag_id: str, usertoken: str = ""
    ) -> None:
        return self.databag_service.delete_databag_by_id(databag_id, usertoken)  # type: ignore

    def start_databag_pipeline(
        self, databag_id: str, usertoken: str = ""
    ) -> Databag:
        return self.databag_service.start_databag_pipeline(
            databag_id, usertoken
        )

    def get_dataset_get_url(self, databag_id: str, usertoken: str = "") -> str:
        return self.databag_service.get_dataset_get_url(databag_id, usertoken)  # type: ignore

    def create_dataset_put_url(
        self, databag_id: str, usertoken: str = ""
    ) -> str:
        return self.databag_service.create_dataset_put_url(  # type: ignore
            databag_id, usertoken
        )

    def get_dataframe_get_url(
        self, databag_id: str, usertoken: str = ""
    ) -> str:
        return self.databag_service.get_dataframe_get_url(  # type: ignore
            databag_id, usertoken
        )

    def create_dataframe_put_url(
        self, databag_id: str, usertoken: str = ""
    ) -> str:
        return self.databag_service.create_dataframe_put_url(  # type: ignore
            databag_id, usertoken
        )

    # ----- solutions -----
    def get_solutions(self, usertoken: str = "") -> list[Solution]:
        return self.solution_service.get_solutions(usertoken)  # type: ignore

    def create_solution(
        self, solution: Solution, usertoken: str = ""
    ) -> Solution:
        return self.solution_service.create_solution(solution, usertoken)

    def get_solution_by_id(
        self, solution_id: str, usertoken: str = ""
    ) -> Solution:
        return self.solution_service.get_solution_by_id(solution_id, usertoken)

    def update_solution_by_id(
        self, solution_id: str, solution: Solution, usertoken: str = ""
    ) -> Solution:
        return self.solution_service.update_solution_by_id(
            solution_id, solution, usertoken
        )

    def delete_solution_by_id(
        self, solution_id: str, usertoken: str = ""
    ) -> None:
        return self.solution_service.delete_solution_by_id(  # type: ignore
            solution_id, usertoken
        )

    def start_solution_pipeline(
        self, solution_id: str, usertoken: str = ""
    ) -> Solution:
        return self.solution_service.start_solution_pipeline(
            solution_id, usertoken
        )

    def get_model_get_url(self, solution_id: str, usertoken: str = "") -> str:
        return self.solution_service.get_model_get_url(solution_id, usertoken)  # type: ignore

    def create_model_put_url(
        self, solution_id: str, usertoken: str = ""
    ) -> str:
        return self.solution_service.create_model_put_url(  # type: ignore
            solution_id, usertoken
        )

    def get_prediction_template_get_url(
        self, solution_id: str, usertoken: str = ""
    ) -> str:
        return self.solution_service.get_prediction_template_get_url(  # type: ignore
            solution_id, usertoken
        )

    def create_prediction_template_put_url(
        self, solution_id: str, usertoken: str = ""
    ) -> str:
        return self.solution_service.create_prediction_template_put_url(  # type: ignore
            solution_id, usertoken
        )

    # ----- predictions -----
    def get_predictions(self, usertoken: str = "") -> list[Prediction]:
        return self.prediction_service.get_predictions(usertoken)  # type: ignore

    def create_prediction(
        self, prediction: Prediction, usertoken: str = ""
    ) -> Prediction:
        return self.prediction_service.create_prediction(prediction, usertoken)

    def get_prediction_by_id(
        self, prediction_id: str, usertoken: str = ""
    ) -> Prediction:
        return self.prediction_service.get_prediction_by_id(
            prediction_id, usertoken
        )

    def update_prediction_by_id(
        self, prediction_id: str, prediction: Prediction, usertoken: str = ""
    ) -> Prediction:
        return self.prediction_service.update_prediction_by_id(
            prediction_id, prediction, usertoken
        )

    def delete_prediction_by_id(
        self, prediction_id: str, usertoken: str = ""
    ) -> None:
        return self.prediction_service.delete_prediction_by_id(  # type: ignore
            prediction_id, usertoken
        )

    def start_prediction_pipeline(
        self, prediction_id: str, usertoken: str = ""
    ) -> Prediction:
        return self.prediction_service.start_prediction_pipeline(
            prediction_id, usertoken
        )

    def get_prediction_data_get_url(
        self, prediction_id: str, usertoken: str = ""
    ) -> str:
        return self.prediction_service.get_prediction_data_get_url(  # type: ignore
            prediction_id, usertoken
        )

    def create_prediction_data_put_url(
        self, prediction_id: str, usertoken: str = ""
    ) -> str:
        return self.prediction_service.create_prediction_data_put_url(  # type: ignore
            prediction_id, usertoken
        )

    def get_prediction_result_get_url(
        self, prediction_id: str, usertoken: str = ""
    ) -> str:
        return self.prediction_service.get_prediction_result_get_url(  # type: ignore
            prediction_id, usertoken
        )

    def create_prediction_result_put_url(
        self, prediction_id: str, usertoken: str = ""
    ) -> str:
        return self.prediction_service.create_prediction_result_put_url(  # type: ignore
            prediction_id, usertoken
        )

    # ----- transfer learning models -----
    def get_transfer_learning_models(
        self, usertoken: str = ""
    ) -> list[TransferLearningModel]:
        return self.transfer_learning_service.get_transfer_learning_models(  # type: ignore
            usertoken
        )

    def create_new_transfer_learning_model_from_solution(
        self,
        new_transfer_learning_model_dto: NewTransferLearningModelDto,
        usertoken: str = "",
    ) -> TransferLearningModel:
        return self.transfer_learning_service.create_new_transfer_learning_model_from_solution(
            new_transfer_learning_model_dto, usertoken
        )

    def get_transfer_learning_model_by_id(
        self, transfer_learning_model_id: str, usertoken: str = ""
    ) -> TransferLearningModel:
        return (
            self.transfer_learning_service.get_transfer_learning_model_by_id(
                transfer_learning_model_id, usertoken
            )
        )

    def update_transfer_learning_model_by_id(
        self,
        transfer_learning_model_id: str,
        transfer_learning_model: TransferLearningModel,
        usertoken: str = "",
    ) -> TransferLearningModel:
        return self.transfer_learning_service.update_transfer_learning_model_by_id(
            transfer_learning_model_id, transfer_learning_model, usertoken
        )

    def delete_transfer_learning_model_by_id(
        self, transfer_learning_model_id: str, usertoken: str = ""
    ) -> None:
        return self.transfer_learning_service.delete_transfer_learning_model_by_id(
            transfer_learning_model_id, usertoken
        )

    def share_transfer_learning_model(
        self,
        transfer_learning_model_id: str,
        user_id_object: UserIdObject,
        usertoken: str = "",
    ) -> TransferLearningModel:
        return self.transfer_learning_service.share_transfer_learning_model(
            transfer_learning_model_id, user_id_object.user_id, usertoken  # type: ignore
        )
