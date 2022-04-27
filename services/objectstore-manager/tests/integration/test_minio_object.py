import json
from typing import Dict, List

import pytest
from fastapi import HTTPException
from starlette.datastructures import Headers
from starlette.requests import Request
from starlette.types import Message

from src.api.routers.object_router import (
    delete_object_by_name,
    get_all_objects,
    get_object_by_name,
    get_object_url,
    get_presigned_put_url,
    put_object_by_name,
)
from src.models import Item, Url
from src.services.minio_service import MinioService
from tests.mocks.minio_mock import MinioMock

minio_mock_client = MinioMock()
minio_service_mock = MinioService(client=minio_mock_client)


async def create_body() -> Message:
    body = {"testBody": "testFile"}
    return {
        "type": "http.request",
        "body": json.dumps(body).encode("utf-8"),
        "more_body": False,
    }


def build_request(headers: Dict = None) -> Request:
    if headers is None:
        headers = {}
    return Request(
        {"type": "http", "headers": Headers(headers).raw}, receive=create_body
    )


@pytest.mark.asyncio
async def test_get_object_by_name():
    url: str = await get_object_by_name(
        bucket_name="os4ml",
        object_name="object",
        minio_service=minio_service_mock,
    )
    assert type(url) == str


@pytest.mark.asyncio
async def test_get_object_by_name_with_exception():
    with pytest.raises(HTTPException) as excinfo:
        await get_object_by_name(
            bucket_name="os5ml",
            object_name="object",
            minio_service=minio_service_mock,
        )
    assert "status_code=404" in str(excinfo)


@pytest.mark.asyncio
async def test_delete_object_by_name():
    await delete_object_by_name(
        bucket_name="os4ml",
        object_name="object",
        minio_service=minio_service_mock,
    )


@pytest.mark.asyncio
async def test_delete_object_by_name_with_exception():
    with pytest.raises(HTTPException) as excinfo:
        await delete_object_by_name(
            bucket_name="os5ml",
            object_name="object",
            minio_service=minio_service_mock,
        )
    assert "status_code=404" in str(excinfo)


@pytest.mark.asyncio
async def test_get_all_objects():
    items: List[Item] = await get_all_objects(
        bucket_name="os4ml", minio_service=minio_service_mock
    )
    assert type(items) == list
    assert type(items.pop()) == Item


@pytest.mark.asyncio
async def test_get_all_objects_with_exception():
    with pytest.raises(HTTPException) as excinfo:
        await get_all_objects(
            bucket_name="os5ml", minio_service=minio_service_mock
        )
    assert "status_code=404" in str(excinfo)


@pytest.mark.asyncio
async def test_get_presigned_url():
    url: Url = await get_presigned_put_url(
        bucket_name="os4ml",
        object_name="object",
        minio_service=minio_service_mock,
    )
    assert type(url) == Url
    assert "https://www.wogra.com" in url.url


@pytest.mark.asyncio
async def test_get_presigned_url_with_exception():
    with pytest.raises(HTTPException) as excinfo:
        await get_presigned_put_url(
            bucket_name="os5ml",
            object_name="object",
            minio_service=minio_service_mock,
        )
    assert "status_code=404" in str(excinfo)


@pytest.mark.asyncio
async def test_put_object_by_name():
    request: Request = build_request()
    await put_object_by_name(
        request=request,
        bucket_name="os4ml",
        object_name="object",
        minio_service=minio_service_mock,
    )


@pytest.mark.asyncio
async def test_get_object_url():
    url: str = await get_object_url(
        bucket_name="os4ml",
        object_name="object",
        minio_service=minio_service_mock,
    )
    assert type(url) == str


@pytest.mark.asyncio
async def test_get_object_url_with_exception():
    with pytest.raises(HTTPException) as excinfo:
        await get_object_url(
            bucket_name="os5ml",
            object_name="object",
            minio_service=minio_service_mock,
        )
    assert "status_code=404" in str(excinfo)
