from fastapi import Depends

from build.openapi_server.models.run import Run
from build.openapi_server.models.run_params import RunParams
from services.run_service import RunService


class JobmanagerApiController:
    def __init__(
        self,
        run_service: RunService = Depends(),
    ):
        self.run_service = run_service

    def get_run_by_id(self, run_id: str, usertoken: str = "") -> Run:
        return self.run_service.get_run_by_id(run_id)

    def terminate_run_by_id(self, run_id: str, usertoken: str = "") -> None:
        return self.run_service.terminate_run_by_id(run_id)

    def create_run_by_solver_name(
        self,
        solver_name: str,
        run_params: RunParams,
        usertoken: str = "",
    ) -> str:
        return self.run_service.create_run_by_solver_name(
            solver_name=solver_name,
            run_params=run_params,
            usertoken=usertoken,
        )
