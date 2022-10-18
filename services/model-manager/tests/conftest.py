import pytest
from fastapi import FastAPI
from fastapi.testclient import TestClient

from api.controller.modelmanager_api_controller import (
    ModelmanagerApiController,
)
from main import app as application
from service.solver_service import SolverService


@pytest.fixture
def app() -> FastAPI:
    application.dependency_overrides = {}

    return application


@pytest.fixture
def client(app) -> TestClient:
    return TestClient(app)


@pytest.fixture
def solver_service():
    return SolverService()


@pytest.fixture
def api_controller(solver_service):
    return ModelmanagerApiController(solver_service=solver_service)
