from fastapi import Depends

from build.openapi_server.models.databag import Databag
from build.openapi_server.models.solver import Solver
from services.solver_service import SolverService
from services.databag_service import DatabagService


class ModelmanagerApiController:
    def __init__(self, solver_service: SolverService = Depends(), databag_service: DatabagService = Depends()):
        self.solver_service = solver_service
        self.databag_service = databag_service

    # solvers
    def get_solvers(self, usertoken: str = "") -> list[Solver]:
        return self.solver_service.list_solvers()  # type: ignore

    def get_solver_by_name(self, solver_name: str, usertoken: str = "") -> Solver:
        return self.solver_service.get_solver_by_name(solver_name)

    # databags
    def get_databags(self, usertoken: str = "") -> list[Databag]:
        if usertoken is None:
            usertoken = ""
        return self.databag_service.list_databags(usertoken)

    def get_databag_by_id(self, databag_id: str, usertoken: str = "") -> Databag:
        return self.databag_service.get_databag_by_id(databag_id, usertoken)

    def create_databag(self, databag_id: str, usertoken: str = "") -> Databag:
        return self.databag_service.create_databag(databag_id, usertoken)

    def update_databag_by_id(self, databag_id: str, databag: Databag, usertoken: str = "") -> None:
        if databag_id != databag.databag_id:
            raise NotImplementedError()
        return self.databag_service.update_databag(databag, usertoken)

    def delete_databag_by_id(self, databag_id: str, usertoken: str = "") -> None:
        return self.databag_service.delete_databag_by_id(databag_id, usertoken)

    def upload_dataset(self, databag_id: str, body: bytes, usertoken: str = "") -> None:
        return self.databag_service.upload_dataset(databag_id, body, usertoken)
