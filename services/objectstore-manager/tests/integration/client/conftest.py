import pytest
from fastapi import FastAPI
from fastapi.testclient import TestClient

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
