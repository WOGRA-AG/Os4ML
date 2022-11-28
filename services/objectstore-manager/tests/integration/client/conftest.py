from unittest.mock import Mock

import pytest
from fastapi import FastAPI
from fastapi.testclient import TestClient

from repository import MinioRepository
from repository.init_repository import init_repository
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
def existing_objects_repository(existing_objects_mock: Mock, app) -> Mock:
    app.dependency_overrides[init_repository] = lambda: MinioRepository(
        existing_objects_mock
    )
    return existing_objects_mock
