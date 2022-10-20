from fastapi import Depends

from build.openapi_server.models.solver import Solver
from service.solver_service import SolverService


class ModelmanagerApiController:
    def __init__(self, solver_service: SolverService = Depends(SolverService)):
        self.solver_service = solver_service

    def get_all_solvers(self) -> list[Solver]:
        return self.solver_service.list_solvers()  # type: ignore
