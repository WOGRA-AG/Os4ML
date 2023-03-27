import pytest
from build.openapi_server.apis.modelmanager_api import get_solvers


@pytest.mark.asyncio
async def test_ludwig_solver_in_get_all_solvers(api_controller):
    solvers = await get_solvers(_controller=api_controller)
    filtered_solvers = [
        solver for solver in solvers if solver.name == "ludwig-solver"
    ]
    assert len(filtered_solvers) == 1
