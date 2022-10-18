import pytest

from service.solver_service import SolverService


@pytest.fixture
def solver_service():
    return SolverService()


def test_ludiwg_solver_in_list_solvers(solver_service):
    solvers = solver_service.list_solvers()
    filtered_solvers = [
        solver for solver in solvers if solver.name == "ludwig-solver"
    ]
    assert filtered_solvers
