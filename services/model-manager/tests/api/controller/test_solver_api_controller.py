import pytest

from build.openapi_server.apis.modelmanager_api import (
    ModelmanagerApiController,
)
from service.solver_service import SolverService


@pytest.fixture
def api_controller():
    solver_service = SolverService()
    return ModelmanagerApiController(solver_service=solver_service)


def test_ludiwg_solver_in_list_solvers(api_controller):
    solvers = api_controller.get_all_solvers()
    filtered_solvers = [
        solver for solver in solvers if solver.name == "ludwig-solver"
    ]
    assert filtered_solvers
