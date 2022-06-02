import pytest
from fastapi import HTTPException

from api.bucket_api_service import BucketApiService
from build.openapi_server.apis.bucket_api import delete_bucket, post_new_bucket
from build.openapi_server.models.bucket import Bucket
from services.minio_service import MinioService
from tests.mocks.minio_mock import MinioMock

mock_minio_client = MinioMock()
mock_minio_service = MinioService(client=mock_minio_client)
mock_bucket_api_service = BucketApiService(minio_service=mock_minio_service)


@pytest.mark.asyncio
async def test_post_new_bucket():
    new_bucket: Bucket = await post_new_bucket(
        bucket_name="os4ml", _service=mock_bucket_api_service,
    )
    assert type(new_bucket) == Bucket


@pytest.mark.asyncio
async def test_post_new_bucket_with_exception():
    with pytest.raises(HTTPException) as excinfo:
        await post_new_bucket(
            bucket_name="os4ml_test", _service=mock_bucket_api_service,
        )
    assert "status_code=400" in str(excinfo)


@pytest.mark.asyncio
async def test_delete_bucket():
    await delete_bucket(
        bucket_name="os4ml", _service=mock_bucket_api_service,
    )


@pytest.mark.asyncio
async def test_delete_bucket_with_non_existant():
    await delete_bucket(bucket_name="os5ml", _service=mock_bucket_api_service)
