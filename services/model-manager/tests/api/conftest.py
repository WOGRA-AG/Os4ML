from unittest.mock import Mock

import pytest
from fastapi import FastAPI
from fastapi.testclient import TestClient
from pytest_mock import MockerFixture

from main import app as application
from src.services.databag_service import DatabagService
from src.services.prediction_service import PredictionSerivce
from src.services.solution_service import SolutionService
from src.services.solver_service import SolverService
from src.services.transfer_learning_service import TransferLearningService


@pytest.fixture
def databag_service(mocker: MockerFixture) -> Mock:
    return mocker.Mock()


@pytest.fixture
def solver_service(mocker: MockerFixture) -> Mock:
    return mocker.Mock()


@pytest.fixture
def solution_service(mocker: MockerFixture) -> Mock:
    return mocker.Mock()


@pytest.fixture
def prediction_service(mocker: MockerFixture) -> Mock:
    return mocker.Mock()


@pytest.fixture
def transfer_learning_service(mocker: MockerFixture) -> Mock:
    return mocker.Mock()


@pytest.fixture
def app(
    databag_service: Mock,
    solver_service: Mock,
    solution_service: Mock,
    prediction_service: Mock,
    transfer_learning_service: Mock,
) -> FastAPI:
    application.dependency_overrides[DatabagService] = lambda: databag_service
    application.dependency_overrides[SolverService] = lambda: solver_service
    application.dependency_overrides[
        SolutionService
    ] = lambda: solution_service
    application.dependency_overrides[
        PredictionSerivce
    ] = lambda: prediction_service
    application.dependency_overrides[
        TransferLearningService
    ] = lambda: transfer_learning_service

    return application


@pytest.fixture
def client(app) -> TestClient:
    return TestClient(app)


@pytest.fixture
def route_prefix() -> str:
    return "/apis/v1beta1/model-manager"
