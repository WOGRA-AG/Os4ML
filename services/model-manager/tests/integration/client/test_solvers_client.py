import pytest
from fastapi.testclient import TestClient


@pytest.mark.asyncio
async def test_ludwig_solver_in_get_solvers(
    client: TestClient, route_prefix: str
):
    resp = client.get(route_prefix + "solvers")
    assert resp.status_code == 200
    solvers = resp.json()
    filtered_solvers = [
        solver for solver in solvers if solver["name"] == "ludwig-solver"
    ]
    assert len(filtered_solvers) == 1
