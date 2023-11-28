import io

import pytest
from google.cloud.storage import Bucket, Client

from repository import StorageRepository, init_repository
from services.storage_service import StorageService


@pytest.fixture(autouse=True)
def use_gcs_backend(monkeypatch):
    monkeypatch.setattr(init_repository, "STORAGE_BACKEND", "gcs")


@pytest.fixture(scope="session")
def client():
    return Client()


@pytest.fixture
def bucket_name():
    return "os4ml-test"


@pytest.fixture(autouse=True)
def create_test_bucket(client: Client, bucket_name: str):
    bucket = Bucket(client, bucket_name)
    if bucket.exists(client):
        bucket.delete(force=True)
    bucket = client.create_bucket(bucket_name)
    yield
    bucket.delete(force=True)


@pytest.fixture
def storage_repository() -> StorageRepository:
    return init_repository.init_repository()


@pytest.fixture
def storage_service(
    storage_repository: StorageRepository, bucket_name: str
) -> StorageService:
    return StorageService(storage_repository, bucket_name)


def _create_object(storage_service: StorageService, name: str, content: bytes):
    file = io.BytesIO()
    size = file.write(content)
    file.seek(0)
    storage_service.create_object_by_name(name, file, size)


@pytest.fixture
def create_object(storage_service):
    object_name = "test_object"
    _create_object(storage_service, object_name, b"This is a test.")
    return object_name


@pytest.fixture
def create_json_object(storage_service):
    object_name = "json_object"
    _create_object(
        storage_service, object_name, b'{"text":"This is valid json."}'
    )
    return object_name
