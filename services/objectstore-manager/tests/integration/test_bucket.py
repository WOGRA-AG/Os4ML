import pytest
from fastapi import HTTPException

from api.controller.objectstore_api_controller import ObjectstoreApiController
from build.openapi_server.apis.objectstore_api import (
    delete_bucket,
    post_new_bucket,
)
from repository.impl.minio_repository import MinioRepository
from tests.mocks.minio_mock import MinioMock

mock_minio_client = MinioMock()
mock_minio_service = MinioRepository(client=mock_minio_client)
mock_objectstore_controller = ObjectstoreApiController(
    storage_service=mock_minio_service
)


@pytest.mark.asyncio
async def test_post_new_bucket():
    new_bucket: str = await post_new_bucket(
        bucket_name="os4ml",
        _controller=mock_objectstore_controller,
    )
    assert type(new_bucket) == str
    assert new_bucket == "os4ml"


@pytest.mark.asyncio
async def test_post_new_bucket_with_exception():
    with pytest.raises(HTTPException) as excinfo:
        await post_new_bucket(
            bucket_name="os4ml_test",
            _controller=mock_objectstore_controller,
        )
    assert "status_code=400" in str(excinfo)


@pytest.mark.asyncio
async def test_delete_bucket():
    await delete_bucket(
        bucket_name="os4ml",
        _controller=mock_objectstore_controller,
    )


@pytest.mark.asyncio
async def test_delete_bucket_with_non_existant():
    await delete_bucket(
        bucket_name="os5ml", _controller=mock_objectstore_controller
    )
