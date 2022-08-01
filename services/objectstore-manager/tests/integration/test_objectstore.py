import pytest

from api.controller.objectstore_api_controller import ObjectstoreApiController
from build.openapi_server.apis.objectstore_api import (
    delete_objects,
    get_all_buckets,
)
from build.openapi_server.models.bucket import Bucket
from repository.impl.minio_repository import MinioRepository
from tests.mocks.minio_mock import MinioMock

mock_minio_client = MinioMock()
mock_minio_service = MinioRepository(client=mock_minio_client)
mock_objectstore_controller = ObjectstoreApiController(storage_service=mock_minio_service)


@pytest.mark.asyncio
async def test_get_all_buckets():
    buckets = await get_all_buckets(
        _controller=mock_objectstore_controller,
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
    minio_mock.remove_objects.return_value = []

    await delete_objects(
        bucket_name="bucket",
        path_prefix="test/prefix",
        _controller=api_service_mock,
    )

    minio_mock.list_objects.assert_called_with(
        "bucket", prefix="test/prefix", recursive=True
    )
    object_name_to_delete = {"test/prefix/data.csv", "test/prefix"}
    bucket, generator = minio_mock.remove_objects.call_args[0]
    assert bucket == "bucket"
    assert {obj._name for obj in generator} == object_name_to_delete
