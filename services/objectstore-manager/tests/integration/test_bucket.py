import pytest
from fastapi import HTTPException
from tests.mocks.minio_mock import MinioMock

from api.bucket_api_service import BucketApiService
from build.openapi_server.apis.bucket_api import delete_bucket, post_new_bucket
from services.minio_service import MinioService

mock_minio_client = MinioMock()
mock_minio_service = MinioService(client=mock_minio_client)
mock_bucket_api_service = BucketApiService(storage_service=mock_minio_service)


@pytest.mark.asyncio
async def test_post_new_bucket():
    new_bucket: str = await post_new_bucket(
        bucket_name="os4ml",
        _service=mock_bucket_api_service,
    )
    assert type(new_bucket) == str
    assert new_bucket == "os4ml"


@pytest.mark.asyncio
async def test_post_new_bucket_with_exception():
    with pytest.raises(HTTPException) as excinfo:
        await post_new_bucket(
            bucket_name="os4ml_test",
            _service=mock_bucket_api_service,
        )
    assert "status_code=400" in str(excinfo)


@pytest.mark.asyncio
async def test_delete_bucket():
    await delete_bucket(
        bucket_name="os4ml",
        _service=mock_bucket_api_service,
    )


@pytest.mark.asyncio
async def test_delete_bucket_with_non_existant():
    await delete_bucket(bucket_name="os5ml", _service=mock_bucket_api_service)
