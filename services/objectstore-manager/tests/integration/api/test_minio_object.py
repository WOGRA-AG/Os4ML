import base64
from collections.abc import Sequence
from unittest.mock import Mock

import pytest
from fastapi.responses import RedirectResponse
from pytest_mock import MockerFixture

from api.controller.objectstore_api_controller import ObjectstoreApiController
from build.openapi_server.apis.objectstore_api import (
    delete_object_by_name,
    delete_objects_with_prefix,
    get_json_object_by_name,
    get_object_by_name,
    get_objects_with_prefix,
    get_presigned_get_url,
    get_presigned_put_url,
    put_object_by_name,
)
from build.openapi_server.models.json_response import JsonResponse
from exceptions import BucketNotFoundException, ObjectNotFoundException


@pytest.mark.asyncio
async def test_delete_object_by_name(
    usertoken: str,
    api_controller_mock: ObjectstoreApiController,
    bucket_exists_minio_mock: Mock,
):
    await delete_object_by_name(
        object_name="test-object.yaml",
        usertoken=usertoken,
        _controller=api_controller_mock,
    )

    bucket_exists_minio_mock.remove_object.assert_called_once_with(
        "test-bucket", "default/test-object.yaml"
    )


@pytest.mark.asyncio
async def test_delete_object_by_name_no_bucket(
    non_existing_bucket_mock: Mock,
    api_controller_mock: ObjectstoreApiController,
    usertoken: str,
):
    await delete_object_by_name(
        object_name="test",
        usertoken=usertoken,
        _controller=api_controller_mock,
    )

    non_existing_bucket_mock.remove_object.assert_not_called()


@pytest.mark.asyncio
async def test_delete_object_non_existing_object(
    non_existing_object_mock: Mock,
    api_controller_mock: ObjectstoreApiController,
    usertoken: str,
):
    await delete_object_by_name(
        object_name="non-existing-object",
        usertoken=usertoken,
        _controller=api_controller_mock,
    )
    non_existing_object_mock.remove_object.assert_not_called()


@pytest.mark.asyncio
async def test_delete_objects_with_prefix(
    existing_objects_mock: Mock,
    api_controller_mock: ObjectstoreApiController,
    usertoken: str,
    object_names: Sequence[str],
):
    existing_objects_mock.remove_objects.return_value = None
    await delete_objects_with_prefix(
        path_prefix="obj", usertoken=usertoken, _controller=api_controller_mock
    )

    delete_objects = existing_objects_mock.remove_objects.call_args[0][1]
    assert {obj._name for obj in delete_objects} == set(object_names)


@pytest.mark.asyncio
async def test_get_object_by_name(
    existing_objects_mock: Mock,
    api_controller_mock: ObjectstoreApiController,
    usertoken: str,
):
    existing_objects_mock.presigned_get_object.return_value = (
        "https://os4ml.com/test-bucket/obj/object2"
    )
    redirect_response: RedirectResponse = await get_object_by_name(
        object_name="obj/object2",
        usertoken=usertoken,
        _controller=api_controller_mock,
    )
    assert type(redirect_response) == RedirectResponse
    assert redirect_response.status_code == 307
    assert (
        redirect_response.headers["location"]
        == "https://os4ml.com/test-bucket/obj/object2"
    )


@pytest.mark.asyncio
async def test_get_json_object_by_name(
    bucket_exists_minio_mock: Mock,
    mocker: MockerFixture,
    api_controller_mock: ObjectstoreApiController,
    usertoken: str,
):
    json_str = '{"name": "test", "time": "2022-07-17T23:01:49Z"}'
    bucket_exists_minio_mock.get_object.return_value = mocker.Mock(
        data=json_str
    )

    json_response = await get_json_object_by_name(
        object_name="test-object",
        _controller=api_controller_mock,
        usertoken=usertoken,
    )

    bucket_exists_minio_mock.bucket_exists.assert_called_once_with(
        "test-bucket"
    )
    bucket_exists_minio_mock.get_object.assert_called_once()
    expected_response = JsonResponse(
        json_content=base64.encodebytes(json_str.encode())
    )
    assert json_response == expected_response


@pytest.mark.asyncio
async def test_get_json_object_by_name_not_fount(
    non_existing_object_mock: Mock,
    api_controller_mock: ObjectstoreApiController,
    usertoken: str,
):
    with pytest.raises(ObjectNotFoundException) as e:
        await get_json_object_by_name(
            object_name="test-object",
            _controller=api_controller_mock,
            usertoken=usertoken,
        )
    assert "test-object" in e.value.message
    non_existing_object_mock.bucket_exists.assert_called_once_with(
        "test-bucket"
    )


@pytest.mark.asyncio
async def test_get_object_by_name_with_exception(
    non_existing_object_mock: Mock,
    api_controller_mock: ObjectstoreApiController,
    usertoken: str,
):
    with pytest.raises(ObjectNotFoundException) as e:
        await get_object_by_name(
            object_name="non-existing-object",
            _controller=api_controller_mock,
            usertoken=usertoken,
        )
    assert "non-existing-object" in e.value.message


@pytest.mark.asyncio
async def test_get_all_objects(
    existing_objects_mock: Mock,
    api_controller_mock: ObjectstoreApiController,
    usertoken: str,
):
    items: list[str] = await get_objects_with_prefix(
        path_prefix="o",
        _controller=api_controller_mock,
        usertoken=usertoken,
    )
    assert set(items) == {"object1", "obj/object2", "other-object"}


@pytest.mark.asyncio
async def test_get_all_objects_with_exception(
    non_existing_bucket_mock: Mock,
    api_controller_mock: ObjectstoreApiController,
    usertoken: str,
):
    with pytest.raises(BucketNotFoundException) as excinfo:
        await get_objects_with_prefix(
            path_prefix="",
            usertoken=usertoken,
            _controller=api_controller_mock,
        )
    assert "test-bucket" in excinfo.value.message


@pytest.mark.asyncio
async def test_get_presigned_get_url(
    existing_objects_mock: Mock,
    api_controller_mock: ObjectstoreApiController,
    usertoken: str,
):
    existing_objects_mock.presigned_get_object.return_value = (
        "https://os4ml.com/test-bucket/obj/object2"
    )
    url = await get_presigned_get_url(
        object_name="obj/object2",
        usertoken=usertoken,
        _controller=api_controller_mock,
    )
    assert url == "https://os4ml.com/test-bucket/obj/object2"


@pytest.mark.asyncio
async def test_get_presigned_get_url_with_non_existing_bucket(
    non_existing_bucket_mock: Mock,
    api_controller_mock: ObjectstoreApiController,
    usertoken: str,
):
    with pytest.raises(BucketNotFoundException) as excinfo:
        await get_presigned_get_url(
            object_name="object_err",
            usertoken=usertoken,
            _controller=api_controller_mock,
        )
    assert "test-bucket" in excinfo.value.message


@pytest.mark.asyncio
async def test_get_presigned_get_url_with_non_existing_object(
    non_existing_object_mock: Mock,
    api_controller_mock: ObjectstoreApiController,
    usertoken: str,
):
    with pytest.raises(ObjectNotFoundException) as excinfo:
        await get_presigned_get_url(
            object_name="object_err",
            usertoken=usertoken,
            _controller=api_controller_mock,
        )
    assert "test-bucket" in excinfo.value.message
    assert "object_err" in excinfo.value.message


@pytest.mark.asyncio
async def test_get_presigned_put_url(
    bucket_exists_minio_mock: Mock,
    api_controller_mock: ObjectstoreApiController,
    usertoken: str,
):
    bucket_exists_minio_mock.presigned_put_object.return_value = (
        "https://os4ml.com/test-bucket/obj/object2"
    )
    url = await get_presigned_put_url(
        object_name="object",
        usertoken=usertoken,
        _controller=api_controller_mock,
    )
    assert url == "https://os4ml.com/test-bucket/obj/object2"


@pytest.mark.asyncio
async def test_get_presigned_put_url_with_non_existing_bucket(
    non_existing_bucket_mock: Mock,
    api_controller_mock: ObjectstoreApiController,
    usertoken: str,
):
    with pytest.raises(BucketNotFoundException) as excinfo:
        await get_presigned_put_url(
            object_name="object_err",
            usertoken=usertoken,
            _controller=api_controller_mock,
        )
    assert "test-bucket" in excinfo.value.message
    non_existing_bucket_mock.presigned_put_object.assert_not_called()


@pytest.mark.asyncio
async def test_put_object_by_name(
    bucket_exists_minio_mock: Mock,
    api_controller_mock: ObjectstoreApiController,
    usertoken: str,
):
    body = b"test"
    object_name = await put_object_by_name(
        object_name="object.yaml",
        body=body,
        usertoken=usertoken,
        _controller=api_controller_mock,
    )
    bucket_exists_minio_mock.put_object.assert_called_once()
    assert object_name.endswith("object.yaml")
