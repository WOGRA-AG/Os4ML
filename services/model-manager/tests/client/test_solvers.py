from unittest.mock import Mock

from fastapi.testclient import TestClient

from src.build.openapi_server.models.solver import Solver
from src.exceptions.resource_not_found import SolverNotFoundException


def test_client(client: TestClient):
    resp = client.get("/")
    assert resp.status_code == 404


def test_get_solvers(
    client: TestClient, route_prefix: str, solver_service: Mock
):
    solver_service.list_solvers.return_value = []
    resp = client.get(f"{route_prefix}/solvers")
    assert resp.status_code == 200
    assert resp.json() == []


def test_get_solver_by_name(
    client: TestClient, route_prefix: str, solver_service: Mock
):
    solver_service.get_solver_by_name = lambda _: Solver(name="ludwig")
    resp = client.get(f"{route_prefix}/solvers/solver1")
    assert resp.status_code == 200
    assert resp.json()["name"] == "ludwig"


def test_get_solver_by_name_not_found(
    client: TestClient, route_prefix: str, solver_service: Mock
):
    solver_service.get_solver_by_name.side_effect = SolverNotFoundException(
        "solver1"
    )
    resp = client.get(f"{route_prefix}/solvers/solver1")
    assert resp.status_code == 404
