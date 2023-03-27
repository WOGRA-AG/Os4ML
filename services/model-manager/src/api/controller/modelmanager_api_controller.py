from build.openapi_server.models.databag import Databag
from build.openapi_server.models.dataset_put_url import DatasetPutUrl
from build.openapi_server.models.prediction import Prediction
from build.openapi_server.models.solution import Solution
from build.openapi_server.models.solver import Solver
from build.openapi_server.models.url_and_prediction_id import (
    UrlAndPredictionId,
)
from fastapi import Depends

from services.databag_service import DatabagService
from services.prediction_service import PredictionSerivce
from services.solution_service import SolutionService
from services.solver_service import SolverService


class ModelmanagerApiController:
    def __init__(
        self,
        solver_service: SolverService = Depends(),
        databag_service: DatabagService = Depends(),
        solution_service: SolutionService = Depends(),
        prediction_service: PredictionSerivce = Depends(),
    ):
        self.solver_service = solver_service
        self.databag_service = databag_service
        self.solution_service = solution_service
        self.prediction_service = prediction_service

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

    def get_dataset_put_url(
        self, file_name: str, usertoken: str = ""
    ) -> DatasetPutUrl:
        return self.databag_service.get_dataset_put_url(file_name, usertoken)

    def get_dataframe_put_url(
        self, databag_id: str, usertoken: str = ""
    ) -> str:
        return self.databag_service.get_dataframe_put_url(  # type: ignore
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

    def delete_solution_by_id(
        self, solution_id: str, usertoken: str = ""
    ) -> None:
        return self.solution_service.delete_solution_by_id(  # type: ignore
            solution_id, usertoken
        )

    def update_solution_by_id(
        self, solution_id: str, solution: Solution, usertoken: str = ""
    ) -> Solution:
        return self.solution_service.update_solution_by_id(
            solution_id, solution, usertoken
        )

    def get_model_put_url(self, solution_id: str, usertoken: str = "") -> str:
        return self.solution_service.get_model_put_url(  # type: ignore
            solution_id, usertoken
        )

    def get_prediction_template_put_url(
        self, solution_id: str, usertoken: str = ""
    ) -> str:
        return self.solution_service.get_prediction_template_put_url(  # type: ignore
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

    def delete_prediction_by_id(
        self, prediction_id: str, usertoken: str = ""
    ) -> None:
        return self.prediction_service.delete_prediction_by_id(  # type: ignore
            prediction_id, usertoken
        )

    def update_prediction_by_id(
        self, prediction_id: str, prediction: Prediction, usertoken: str = ""
    ) -> Prediction:
        return self.prediction_service.update_prediction_by_id(
            prediction_id, prediction, usertoken
        )

    def get_prediction_data_put_url(
        self, solution_id: str, usertoken: str = ""
    ) -> UrlAndPredictionId:
        return self.prediction_service.get_prediction_data_put_url(
            solution_id, usertoken
        )

    def get_prediction_result_put_url(
        self, prediction_id: str, usertoken: str = ""
    ) -> str:
        return self.prediction_service.get_prediction_result_put_url(  # type: ignore
            prediction_id, usertoken
        )
