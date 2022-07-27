import pytest
from minio.deleteobjects import DeleteObject

from api.objectstore_api_service import ObjectstoreApiService
from build.openapi_server.apis.objectstore_api import (
    delete_objects,
    get_all_buckets,
)
from build.openapi_server.models.bucket import Bucket
from services.minio_service import MinioService
from tests.mocks.minio_mock import MinioMock

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


@pytest.mark.asyncio
async def test_delete_items(api_service_mock, minio_mock, mocker):
    minio_mock.bucket_exists.return_value = True
    minio_mock.list_objects.return_value = [
        mocker.Mock(bucket_name="os4ml", object_name="test/prefix/data.csv"),
        mocker.Mock(bucket_name="os4ml", object_name="test/prefix"),
    ]

    await delete_objects(
        bucket_name="bucket",
        path_prefix="test/prefix",
        _service=api_service_mock,
    )

    minio_mock.list_objects.assert_called_with(
        "bucket", prefix="test/prefix", recursive=True
    )
    object_name_to_delete = {"test/prefix/data.csv", "test/prefix"}
    bucket, generator = minio_mock.remove_objects.call_args[0]
    assert bucket == "bucket"
    assert {obj._name for obj in generator} == object_name_to_delete
