import pytest

from src.api.routers.objectstore_router import get_all_buckets
from src.models import Bucket
from src.services.minio_service import MinioServiceInterface
from tests.mocks.minio_mock import MinioMock

minio_mock_client = MinioMock()
minio_service_mock = MinioServiceInterface(client=minio_mock_client)


@pytest.mark.asyncio
async def test_get_all_buckets():
    buckets = await get_all_buckets(minio_service=minio_service_mock)
    assert type(buckets) == list
    assert len(buckets) > 0
    assert type(buckets.pop()) == Bucket
