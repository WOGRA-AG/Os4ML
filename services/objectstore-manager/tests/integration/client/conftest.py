from unittest.mock import Mock

import pytest
from fastapi import FastAPI
from fastapi.testclient import TestClient
from pytest_mock import MockerFixture

import repository.impl.minio_repository
from src.main import app as application


@pytest.fixture
def app() -> FastAPI:
    application.dependency_overrides = {}

    return application


@pytest.fixture
def client(
    app: FastAPI, mocker: MockerFixture, minio_mock: Mock
) -> TestClient:
    mocker.patch.object(
        repository.impl.minio_repository,
        "get_minio_client",
        return_value=minio_mock,
    )
    return TestClient(app)


@pytest.fixture
def route_prefix() -> str:
    return "/apis/v1beta1/objectstore/"
