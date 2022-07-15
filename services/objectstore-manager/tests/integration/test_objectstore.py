import pytest
from tests.mocks.minio_mock import MinioMock

from api.objectstore_api_service import ObjectstoreApiService
from build.openapi_server.apis.objectstore_api import get_all_buckets
from build.openapi_server.models.bucket import Bucket
from services.minio_service import MinioService

mock_minio_client = MinioMock()
mock_minio_service = MinioService(client=mock_minio_client)
mock_object_api_service = ObjectstoreApiService(
    storage_service=mock_minio_service
)


@pytest.mark.asyncio
async def test_get_all_buckets():
    buckets = await get_all_buckets(
        _service=mock_object_api_service,
    )
    assert type(buckets) == list
    assert len(buckets) > 0
    assert type(buckets.pop()) == Bucket
