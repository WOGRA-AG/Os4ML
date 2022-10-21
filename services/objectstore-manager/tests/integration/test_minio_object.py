import base64
from typing import List

import pytest
from fastapi import HTTPException, status
from fastapi.responses import RedirectResponse
from minio.datatypes import Object as MinioObject
from minio.error import S3Error
from pytest_mock import MockerFixture

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
async def test_get_object_by_name(api_service_mock, minio_mock, mocker: MockerFixture):
    objects_mock = mocker.MagicMock(
        side_effects=[
            [MinioObject(bucket_name="os4ml", object_name="object")]
        ]
    )
    mocker.patch.object(MinioMock, 'list_objects', objects_mock)
    get_objects_mock = mocker.MagicMock(
        return_value="https://os4ml.com/test.csv"
    )
    mocker.patch.object(MinioMock, 'presigned_get_object', get_objects_mock)
    minio_mock.presigned_get_object.return_value = "https://os4ml.com/test.csv"
    redirect_response: RedirectResponse = await get_object_by_name(
        bucket_name="os4ml",
        object_name="object",
        usertoken=user_header.get("usertoken"),
        _controller=api_service_mock,
    )
    assert type(redirect_response) == RedirectResponse
    assert (
        redirect_response.headers["location"] == "https://os4ml.com/test.csv"
    )


@pytest.mark.asyncio
async def test_get_json_object_by_name(api_service_mock, minio_mock, mocker):
    bucket_mock = mocker.MagicMock(
        return_value=True
    )
    bucket_exists_mock = mocker.patch.object(MinioMock, 'bucket_exists', bucket_mock)
    json_str = '{"name": "test", "time": "2022-07-17T23:01:49Z"}'
    object_mock = mocker.MagicMock(
        return_value=mocker.Mock(data=json_str)
    )
    get_object_mock = mocker.patch.object(MinioMock, 'get_object', object_mock)

    json_response = await get_json_object_by_name(
        bucket_name="test-bucket",
        object_name="test-object",
        _controller=api_service_mock,
        usertoken=user_header.get("usertoken"),
    )

    bucket_exists_mock.assert_called_once_with("test-bucket")
    get_object_mock.assert_called_once()
    expected_response = JsonResponse(
        json_content=base64.encodebytes(json_str.encode())
    )
    assert json_response == expected_response


@pytest.mark.asyncio
async def test_get_json_object_by_name_not_fount(api_service_mock, minio_mock, mocker: MockerFixture):
    bucket_mock = mocker.patch.object(MinioMock, 'bucket_exists', mocker.MagicMock(return_value=False))

    with pytest.raises(HTTPException) as e:
        await get_json_object_by_name(
            bucket_name="test-bucket",
            object_name="test-object",
            _controller=api_service_mock,
            usertoken=user_header.get("usertoken"),
        )

    assert e.value.status_code == status.HTTP_404_NOT_FOUND
    bucket_mock.assert_called_once_with("test-bucket")


@pytest.mark.asyncio
async def test_get_object_by_name_with_exception():
    with pytest.raises(HTTPException) as excinfo:
        await get_object_by_name(
            bucket_name="os5ml",
            object_name="object",
            _controller=mock_objectstore_controller,
            usertoken=user_header.get("usertoken"),
        )
    assert "status_code=404" in str(excinfo)


@pytest.mark.asyncio
async def test_delete_object_by_name():
    await delete_object_by_name(
        bucket_name="os4ml",
        object_name="object",
        _controller=mock_objectstore_controller,
        usertoken=user_header.get("usertoken"),
    )


@pytest.mark.asyncio
async def test_delete_object_by_name_with_exception():
    with pytest.raises(HTTPException) as excinfo:
        await delete_object_by_name(
            bucket_name="os5ml",
            object_name="object",
            _controller=mock_objectstore_controller,
            usertoken=user_header.get("usertoken"),
        )
    assert "status_code=404" in str(excinfo)


@pytest.mark.asyncio
async def test_get_all_objects():
    items: List[Item] = await get_objects(
        bucket_name="os4ml",
        path_prefix="",
        _controller=mock_objectstore_controller,
        usertoken=user_header.get("usertoken"),
    )
    assert type(items) == list
    assert type(items.pop()) == Item


@pytest.mark.asyncio
async def test_get_all_objects_with_path_prefix(
    api_service_mock, minio_mock, mocker
):
    bucket_mock = mocker.patch.object(MinioMock, 'bucket_exists', mocker.MagicMock(return_value=True))
    list_obj = mocker.MagicMock(return_value=[
        mocker.Mock(bucket_name="os4ml", object_name="test/prefix/data.csv"),
        mocker.Mock(bucket_name="os4ml", object_name="test/prefix"),
    ])
    obj_mock = mocker.patch.object(MinioMock, 'list_objects', list_obj)

    items: List[Item] = await get_objects(
        bucket_name="os4ml",
        path_prefix="test/prefix",
        usertoken=user_header.get("usertoken"),
        _controller=api_service_mock,
    )

    assert len(items) == 2
    object_names = {item.object_name for item in items}
    assert {"test/prefix/data.csv", "test/prefix"} <= object_names
    obj_mock.assert_called_once()


@pytest.mark.asyncio
async def test_get_all_objects_with_exception():
    with pytest.raises(HTTPException) as excinfo:
        await get_objects(
            bucket_name="os5ml",
            path_prefix="",
            usertoken=user_header.get("usertoken"),
            _controller=mock_objectstore_controller,
        )
    assert "status_code=404" in str(excinfo)


@pytest.mark.asyncio
def test_get_presigned_url(client, mocker: MockerFixture):
    mocker.patch("minio.Minio.__init__", return_value=None)
    mocker.patch("minio.Minio.presigned_get_object", return_value=[""])
    mocker.patch("minio.Minio.bucket_exists", return_value=[True])
    mocker.patch("minio.Minio._get_region", return_value=["de"])
    mocker.patch("minio.Minio.get_presigned_url", return_value=[""])
    url: str = client.get(
        "/apis/v1beta1/objectstore/presignedputurl",
        params={"bucketName": "os4ml", "objectName": "object"},
        headers=user_header,
    ).url
    assert type(url) == str
    assert (
        url
        == "http://testserver/apis/v1beta1/objectstore/presignedputurl?bucketName=os4ml&objectName=object"
    )


@pytest.mark.asyncio
async def test_put_object_by_name():
    body = b"test"
    item: Item = await put_object_by_name(
        body=body,
        bucket_name="os4ml",
        object_name="object",
        usertoken=user_header.get("usertoken"),
        _controller=mock_objectstore_controller,
    )
    assert item.bucket_name == "os4ml"
    assert item.object_name == "object"


@pytest.mark.asyncio
async def test_get_object_url(api_service_mock, minio_mock):
    minio_mock.stat_object.return_value = None
    minio_mock.presigned_get_object.return_value = (
        "https://presigned.bla/bla_bla"
    )
    url: str = await get_object_url(
        object_name="object",
        usertoken=user_header.get("usertoken"),
        _controller=api_service_mock,
    )
    assert type(url) == str
