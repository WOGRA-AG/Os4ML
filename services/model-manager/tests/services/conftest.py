from typing import Any
from unittest.mock import Mock

import pytest
from pytest_mock import MockerFixture

from src.build.openapi_server.models.databag import Databag
from src.build.openapi_server.models.prediction import Prediction
from src.build.openapi_server.models.solution import Solution
from src.services.databag_service import DatabagService
from src.services.prediction_service import PredictionSerivce
from src.services.solution_service import SolutionService


@pytest.fixture
def objectstore(mocker) -> Mock:
    return mocker.Mock()


@pytest.fixture
def jobmanager(mocker) -> Mock:
    return mocker.Mock()


@pytest.fixture
def messaging_service(mocker) -> Mock:
    return mocker.Mock()


@pytest.fixture
def databag_service(objectstore: Mock, jobmanager: Mock) -> DatabagService:
    return DatabagService(objectstore=objectstore, jobmanager=jobmanager)


@pytest.fixture
def solution_service(
    databag_service: DatabagService, objectstore: Mock, jobmanager: Mock
) -> SolutionService:
    return SolutionService(
        databag_service=databag_service,
        objectstore=objectstore,
        jobmanager=jobmanager,
    )


@pytest.fixture
def prediction_service(
    databag_service: DatabagService,
    solution_service: SolutionService,
    objectstore: Mock,
    jobmanager: Mock,
) -> PredictionSerivce:
    return PredictionSerivce(
        databag_service=databag_service,
        solution_service=solution_service,
        objectstore=objectstore,
        jobmanager=jobmanager,
    )


@pytest.fixture
def prediction() -> Prediction:
    return Prediction(
        id="prediction_id",
        name="prediction",
        solution_id="solution_id",
        run_id="run_id",
    )


@pytest.fixture
def solution() -> Solution:
    return Solution(id="solution_id", databag_id="databag_id")


@pytest.fixture
def databag() -> Databag:
    return Databag(id="databag_id")


@pytest.fixture
def prediction_dict() -> dict[str, Any]:
    return {
        "id": "prediction_id",
        "name": "prediction",
        "solution_id": "solution_id",
        "run_id": "run_id",
    }


@pytest.fixture
def equal_mock(mocker: MockerFixture) -> Mock:
    mock = mocker.Mock()
    mock.__eq__ = mocker.Mock(return_value=True)
    return mock
