import pytest
from fastapi import HTTPException

from src.api.routers.bucket_router import delete_bucket, post_new_bucket
from src.models import Bucket
from src.services.minio_service import MinioServiceInterface
from tests.mocks.minio_mock import MinioMock

minio_mock_client = MinioMock()
minio_service_mock = MinioServiceInterface(client=minio_mock_client)


@pytest.mark.asyncio
async def test_post_new_bucket():
    new_bucket: Bucket = await post_new_bucket(bucket_name="os4ml", minio_service=minio_service_mock)
    assert type(new_bucket) == Bucket


@pytest.mark.asyncio
async def test_post_new_bucket_with_exception():
    with pytest.raises(HTTPException) as excinfo:
        await post_new_bucket(bucket_name="os4ml_test", minio_service=minio_service_mock)
    assert "status_code=400" in str(excinfo)


@pytest.mark.asyncio
async def test_delete_bucket():
    await delete_bucket(bucket_name="os4ml", minio_service=minio_service_mock)


@pytest.mark.asyncio
async def test_delete_bucket_with_exception():
    with pytest.raises(HTTPException) as excinfo:
        await delete_bucket(bucket_name="os5ml", minio_service=minio_service_mock)
    assert "status_code=404" in str(excinfo)