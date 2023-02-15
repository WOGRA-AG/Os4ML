from fastapi import Depends

from build.openapi_server.models.databag import Databag
from build.openapi_server.models.dataset_put_url import DatasetPutUrl
from build.openapi_server.models.solution import Solution
from build.openapi_server.models.solver import Solver
from services.databag_service import DatabagService
from services.solution_service import SolutionService
from services.solver_service import SolverService


class ModelmanagerApiController:
    def __init__(
        self,
        solver_service: SolverService = Depends(),
        databag_service: DatabagService = Depends(),
        solution_service: SolutionService = Depends(),
    ):
        self.solver_service = solver_service
        self.databag_service = databag_service
        self.solution_service = solution_service

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

    def get_dataset_put_url(
        self, file_name: str, usertoken: str = ""
    ) -> DatasetPutUrl:
        return self.databag_service.get_dataset_put_url(file_name, usertoken)

    def get_databag_by_id(
        self, databag_id: str, usertoken: str = ""
    ) -> Databag:
        return self.databag_service.get_databag_by_id(databag_id, usertoken)

    def create_databag(self, databag: Databag, usertoken: str = "") -> Databag:
        return self.databag_service.create_databag(databag, usertoken)

    def update_databag_by_id(
        self, databag_id: str, databag: Databag, usertoken: str = ""
    ) -> None:
        return self.databag_service.update_databag(databag_id, databag, usertoken)  # type: ignore

    def delete_databag_by_id(
        self, databag_id: str, usertoken: str = ""
    ) -> None:
        return self.databag_service.delete_databag_by_id(databag_id, usertoken)  # type: ignore

    def download_dataset(self, databag_id: str, usertoken: str = "") -> str:
        return self.databag_service.download_dataset(databag_id, usertoken)  # type: ignore

    def download_dataframe(self, databag_id: str, usertoken: str = "") -> str:
        return self.databag_service.download_dataframe(databag_id, usertoken)  # type: ignore

    def upload_dataframe(
        self, databag_id: str, body: bytes, usertoken: str = ""
    ) -> None:
        return self.databag_service.upload_dataframe(  # type: ignore
            databag_id, body, usertoken
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

    def download_model(self, solution_id: str, usertoken: str = "") -> str:
        return self.solution_service.download_model(solution_id, usertoken)  # type: ignore

    def upload_model(
        self, solution_id: str, body: bytes, usertoken: str = ""
    ) -> None:
        return self.solution_service.upload_model(  # type: ignore
            solution_id, body, usertoken
        )
