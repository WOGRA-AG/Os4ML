from unittest.mock import Mock

import pytest
from fastapi import FastAPI
from fastapi.testclient import TestClient
from pytest_mock import MockerFixture

import repository.init_repository
from repository import MinioRepository
from src.main import app as application


@pytest.fixture
def app() -> FastAPI:
    application.dependency_overrides = {}

    return application


@pytest.fixture
def client(app) -> TestClient:
    return TestClient(app)


@pytest.fixture
def route_prefix() -> str:
    return "/apis/v1beta1/objectstore/"


@pytest.fixture
def existing_objects_repository(
    existing_objects_mock: Mock, mocker: MockerFixture
) -> Mock:
    mocker.patch.object(
        repository.init_repository,
        "init_repository",
        return_value=MinioRepository(existing_objects_mock),
    )
    return existing_objects_mock
