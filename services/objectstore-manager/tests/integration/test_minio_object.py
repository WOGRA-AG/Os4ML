import base64
from typing import List

import pytest
from fastapi import HTTPException, status
from fastapi.responses import RedirectResponse

from api.controller.objectstore_api_controller import ObjectstoreApiController
from build.openapi_server.apis.objectstore_api import (
    delete_object_by_name,
    get_json_object_by_name,
    get_object_by_name,
    get_object_url,
    get_objects,
    get_presigned_put_url,
    put_object_by_name,
)
from build.openapi_server.models.item import Item
from build.openapi_server.models.json_response import JsonResponse
from repository.impl.minio_repository import MinioRepository
from tests.mocks.minio_mock import MinioMock

mock_minio_client = MinioMock()
mock_minio_service = MinioRepository(client=mock_minio_client)
mock_objectstore_controller = ObjectstoreApiController(
    storage_service=mock_minio_service
)


@pytest.mark.asyncio
async def test_get_object_by_name(api_service_mock, minio_mock):
    minio_mock.presigned_get_object.return_value = "https://os4ml.com/test.csv"
    redirect_response: RedirectResponse = await get_object_by_name(
        bucket_name="os4ml",
        object_name="object",
        _controller=api_service_mock,
    )
    assert type(redirect_response) == RedirectResponse
    assert (
        redirect_response.headers["location"] == "https://os4ml.com/test.csv"
    )


@pytest.mark.asyncio
async def test_get_json_object_by_name(api_service_mock, minio_mock, mocker):
    minio_mock.bucket_exists.return_value = True
    json_str = '{"name": "test", "time": "2022-07-17T23:01:49Z"}'
    minio_mock.get_object.return_value = mocker.Mock(data=json_str)

    json_response = await get_json_object_by_name(
        "test-bucket", "test-object", api_service_mock
    )

    minio_mock.bucket_exists.assert_called_once_with("test-bucket")
    minio_mock.get_object.assert_called_once_with("test-bucket", "test-object")
    expected_response = JsonResponse(
        json_content=base64.encodebytes(json_str.encode())
    )
    assert json_response == expected_response


@pytest.mark.asyncio
async def test_get_json_object_by_name_not_fount(api_service_mock, minio_mock):
    minio_mock.bucket_exists.return_value = False

    with pytest.raises(HTTPException) as e:
        await get_json_object_by_name(
            "test-bucket", "test-object", api_service_mock
        )

    assert e.value.status_code == status.HTTP_404_NOT_FOUND
    minio_mock.bucket_exists.assert_called_once_with("test-bucket")


@pytest.mark.asyncio
async def test_get_object_by_name_with_exception():
    with pytest.raises(HTTPException) as excinfo:
        await get_object_by_name(
            bucket_name="os5ml",
            object_name="object",
            _controller=mock_objectstore_controller,
        )
    assert "status_code=404" in str(excinfo)


@pytest.mark.asyncio
async def test_delete_object_by_name():
    await delete_object_by_name(
        bucket_name="os4ml",
        object_name="object",
        _controller=mock_objectstore_controller,
    )


@pytest.mark.asyncio
async def test_delete_object_by_name_with_exception():
    with pytest.raises(HTTPException) as excinfo:
        await delete_object_by_name(
            bucket_name="os5ml",
            object_name="object",
            _controller=mock_objectstore_controller,
        )
    assert "status_code=404" in str(excinfo)


@pytest.mark.asyncio
async def test_get_all_objects():
    items: List[Item] = await get_objects(
        bucket_name="os4ml",
        path_prefix=None,
        _controller=mock_objectstore_controller,
    )
    assert type(items) == list
    assert type(items.pop()) == Item


@pytest.mark.asyncio
async def test_get_all_objects_with_path_prefix(
    api_service_mock, minio_mock, mocker
):
    minio_mock.bucket_exists.return_value = True
    minio_mock.list_objects.return_value = [
        mocker.Mock(bucket_name="os4ml", object_name="test/prefix/data.csv"),
        mocker.Mock(bucket_name="os4ml", object_name="test/prefix"),
    ]

    items: List[Item] = await get_objects(
        bucket_name="os4ml",
        path_prefix="test/prefix",
        _controller=api_service_mock,
    )

    assert len(items) == 2
    object_names = {item.object_name for item in items}
    assert {"test/prefix/data.csv", "test/prefix"} <= object_names
    minio_mock.list_objects.assert_called_with(
        "os4ml", prefix="test/prefix", recursive=True
    )


@pytest.mark.asyncio
async def test_get_all_objects_with_exception():
    with pytest.raises(HTTPException) as excinfo:
        await get_objects(
            bucket_name="os5ml",
            _controller=mock_objectstore_controller,
        )
    assert "status_code=404" in str(excinfo)


@pytest.mark.asyncio
async def test_get_presigned_url():
    url: str = await get_presigned_put_url(
        object_name="object",
        _controller=mock_objectstore_controller,
    )
    assert type(url) == str
    assert url == "https://www.wogra.com"


@pytest.mark.asyncio
async def test_get_presigned_url_with_exception():
    with pytest.raises(HTTPException) as excinfo:
        await get_presigned_put_url(
            object_name="object_err",
            _controller=mock_objectstore_controller,
        )
    assert "status_code=404" in str(excinfo)


@pytest.mark.asyncio
async def test_put_object_by_name():
    body = b"test"
    item: Item = await put_object_by_name(
        body=body,
        bucket_name="os4ml",
        object_name="object",
        _controller=mock_objectstore_controller,
    )
    assert item.bucket_name == "os4ml"
    assert item.object_name == "object"


@pytest.mark.asyncio
async def test_get_object_url():
    url: str = await get_object_url(
        object_name="object",
        _controller=mock_objectstore_controller,
    )
    assert type(url) == str


@pytest.mark.asyncio
async def test_get_object_url_with_exception():
    with pytest.raises(HTTPException) as excinfo:
        await get_object_url(
            object_name="object_err",
            _controller=mock_objectstore_controller,
        )
    assert "status_code=404" in str(excinfo)
