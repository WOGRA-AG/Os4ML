import json
from typing import Dict, List

import pytest
from fastapi import HTTPException
from fastapi.responses import RedirectResponse
from starlette.datastructures import Headers
from starlette.requests import Request
from starlette.types import Message

from api.object_api_service import ObjectApiService
from build.openapi_server.apis.object_api import (
    delete_object_by_name,
    get_all_objects,
    get_object_by_name,
    get_object_url,
    get_presigned_put_url,
    put_object_by_name,
)
from build.openapi_server.models.item import Item
from build.openapi_server.models.url import Url
from services.minio_service import MinioService
from tests.mocks.minio_mock import MinioMock

mock_minio_client = MinioMock()
mock_minio_service = MinioService(client=mock_minio_client)
mock_object_api_service = ObjectApiService(minio_service=mock_minio_service)


@pytest.mark.asyncio
async def test_get_object_by_name():
    redirect_response: RedirectResponse = await get_object_by_name(
        bucket_name="os4ml",
        object_name="object",
        _service=mock_object_api_service,
    )
    assert type(redirect_response) == RedirectResponse
    assert redirect_response.headers["location"] == "https://www.wogra.com"


@pytest.mark.asyncio
async def test_get_object_by_name_with_exception():
    with pytest.raises(HTTPException) as excinfo:
        await get_object_by_name(
            bucket_name="os5ml",
            object_name="object",
            _service=mock_object_api_service,
        )
    assert "status_code=404" in str(excinfo)


@pytest.mark.asyncio
async def test_delete_object_by_name():
    await delete_object_by_name(
        bucket_name="os4ml",
        object_name="object",
        _service=mock_object_api_service,
    )


@pytest.mark.asyncio
async def test_delete_object_by_name_with_exception():
    with pytest.raises(HTTPException) as excinfo:
        await delete_object_by_name(
            bucket_name="os5ml",
            object_name="object",
            _service=mock_object_api_service,
        )
    assert "status_code=404" in str(excinfo)


@pytest.mark.asyncio
async def test_get_all_objects():
    items: List[Item] = await get_all_objects(
        bucket_name="os4ml", _service=mock_object_api_service,
    )
    assert type(items) == list
    assert type(items.pop()) == Item


@pytest.mark.asyncio
async def test_get_all_objects_with_exception():
    with pytest.raises(HTTPException) as excinfo:
        await get_all_objects(
            bucket_name="os5ml", _service=mock_object_api_service,
        )
    assert "status_code=404" in str(excinfo)


@pytest.mark.asyncio
async def test_get_presigned_url():
    url: Url = await get_presigned_put_url(
        bucket_name="os4ml",
        object_name="object",
        _service=mock_object_api_service,
    )
    assert type(url) == Url
    assert "https://www.wogra.com" in url.url


@pytest.mark.asyncio
async def test_get_presigned_url_with_exception():
    with pytest.raises(HTTPException) as excinfo:
        await get_presigned_put_url(
            bucket_name="os5ml",
            object_name="object",
            _service=mock_object_api_service,
        )
    assert "status_code=404" in str(excinfo)


@pytest.mark.asyncio
async def test_put_object_by_name():
    body = b"test"
    item: Item = await put_object_by_name(
        body=body,
        bucket_name="os4ml",
        object_name="object",
        _service=mock_object_api_service,
    )
    assert item.bucket_name == "os4ml"
    assert item.object_name == "object"


@pytest.mark.asyncio
async def test_get_object_url():
    url: str = await get_object_url(
        bucket_name="os4ml",
        object_name="object",
        _service=mock_object_api_service,
    )
    assert type(url) == str


@pytest.mark.asyncio
async def test_get_object_url_with_exception():
    with pytest.raises(HTTPException) as excinfo:
        await get_object_url(
            bucket_name="os5ml",
            object_name="object",
            _service=mock_object_api_service,
        )
    assert "status_code=404" in str(excinfo)
