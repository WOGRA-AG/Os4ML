from unittest.mock import Mock

import pytest
from pytest_mock import MockerFixture

import repository.impl.minio_repository
from api.controller.objectstore_api_controller import ObjectstoreApiController
from build.openapi_server.models.user import User
from repository.impl.minio_repository import MinioRepository
from services.storage_service import StorageService


@pytest.fixture
def minio_repository_mock(
    minio_mock: Mock, mocker: MockerFixture
) -> MinioRepository:
    mocker.patch.object(
        repository.impl.minio_repository,
        "get_minio_client",
        return_value=minio_mock,
    )
    return MinioRepository()


@pytest.fixture
def storage_service_mock(
    minio_repository_mock: MinioRepository,
) -> StorageService:
    return StorageService(minio_repository_mock)


@pytest.fixture
def default_user() -> User:
    return User(id="default", email="email", raw_token="")


@pytest.fixture
def api_controller_mock(
    storage_service_mock: StorageService, bucket_name: str, default_user: User
) -> ObjectstoreApiController:
    return ObjectstoreApiController(
        storage_service=storage_service_mock,
        user=default_user,
        bucket_name=bucket_name,
    )
