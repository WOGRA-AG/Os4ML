import pytest
from fastapi import HTTPException

from api.controller.objectstore_api_controller import ObjectstoreApiController
from build.openapi_server.apis.objectstore_api import (
    delete_bucket,
    post_new_bucket,
)
from build.openapi_server.models.user import User
from repository.impl.minio_repository import MinioRepository
from services.databag_service import DatabagService
from services.storage_service import StorageService
from tests.conftest import user_header
from tests.mocks.minio_mock import MinioMock

mock_minio_client = MinioMock()
mock_minio_repository = MinioRepository(client=mock_minio_client)
mock_storage_service = StorageService(mock_minio_repository)
mock_databag_service = DatabagService(mock_minio_repository)
mock_objectstore_controller = ObjectstoreApiController(
    storage_service=mock_storage_service,
    databag_service=mock_databag_service,
    user=User(id="default", email="email", raw_token=""),
)


@pytest.mark.asyncio
async def test_post_new_bucket():
    new_bucket: str = await post_new_bucket(
        bucket_name="os4ml",
        usertoken=user_header.get("usertoken"),
        _controller=mock_objectstore_controller,
    )
    assert type(new_bucket) == str
    assert new_bucket == "os4ml"


@pytest.mark.asyncio
async def test_post_new_bucket_with_exception():
    with pytest.raises(HTTPException) as excinfo:
        await post_new_bucket(
            bucket_name="os4ml_test",
            usertoken=user_header.get("usertoken"),
            _controller=mock_objectstore_controller,
        )
    assert "status_code=400" in str(excinfo)


@pytest.mark.asyncio
async def test_delete_bucket():
    await delete_bucket(
        bucket_name="os4ml",
        usertoken=user_header.get("usertoken"),
        _controller=mock_objectstore_controller,
    )


@pytest.mark.asyncio
async def test_delete_bucket_with_non_existant():
    await delete_bucket(
        bucket_name="os5ml",
        usertoken=user_header.get("usertoken"),
        _controller=mock_objectstore_controller,
    )
