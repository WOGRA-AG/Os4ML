import pytest

from src.api.controller.modelmanager_api_controller import (
    ModelmanagerApiController,
)
from src.services.solver_service import SolverService


@pytest.fixture
def solver_service() -> SolverService:
    return SolverService()


@pytest.fixture
def api_controller(solver_service) -> ModelmanagerApiController:
    return ModelmanagerApiController(solver_service=solver_service)
