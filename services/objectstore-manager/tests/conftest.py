import pytest
from fastapi import FastAPI
from fastapi.testclient import TestClient

from api.object_api_service import ObjectApiService
from services.minio_service import MinioService
from src.main import app as application


@pytest.fixture
def app() -> FastAPI:
    application.dependency_overrides = {}

    return application


@pytest.fixture
def client(app) -> TestClient:
    return TestClient(app)


@pytest.fixture
def minio_mock(mocker):
    return mocker.Mock()


@pytest.fixture
def api_service_mock(minio_mock):
    minio_service_mock = MinioService(client=minio_mock)
    return ObjectApiService(storage_service=minio_service_mock)
