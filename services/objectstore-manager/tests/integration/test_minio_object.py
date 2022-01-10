from typing import List

import pytest
from fastapi import HTTPException

from api.routers.object_router import get_object_by_name, delete_object_by_name, get_all_objects, get_presigned_put_url
from models import Item, Url
from tests.mocks.minio_mock import MinioMock
from services.minio_service import MinioServiceInterface

minio_mock_client = MinioMock()
minio_service_mock = MinioServiceInterface(client=minio_mock_client)


@pytest.mark.asyncio
async def test_get_object_by_name():
    url: str = await get_object_by_name(bucket_name="os4ml", object_name="object", minio_service=minio_service_mock)
    assert type(url) == str


@pytest.mark.asyncio
async def test_get_object_by_name_with_exception():
    with pytest.raises(HTTPException) as excinfo:
        await get_object_by_name(bucket_name="os5ml", object_name="object", minio_service=minio_service_mock)
    assert 'status_code=404' in str(excinfo)


@pytest.mark.asyncio
async def test_delete_object_by_name():
    await delete_object_by_name(bucket_name="os4ml", object_name="object", minio_service=minio_service_mock)


@pytest.mark.asyncio
async def test_delete_object_by_name_with_exception():
    with pytest.raises(HTTPException) as excinfo:
        await delete_object_by_name(bucket_name="os5ml", object_name="object", minio_service=minio_service_mock)
    assert 'status_code=404' in str(excinfo)


@pytest.mark.asyncio
async def test_get_all_objects():
    items: List[Item] = await get_all_objects(bucket_name="os4ml", minio_service=minio_service_mock)
    assert type(items) == list
    assert type(items.pop()) == Item


@pytest.mark.asyncio
async def test_get_all_objects_with_exception():
    with pytest.raises(HTTPException) as excinfo:
        await get_all_objects(bucket_name="os5ml", minio_service=minio_service_mock)
    assert 'status_code=404' in str(excinfo)

@pytest.mark.asyncio
async def test_get_presigned_url():
    url: Url = await get_presigned_put_url(bucket_name="os4ml", object_name="object", minio_service=minio_service_mock)
    assert type(url) == Url
    assert "https://www.wogra.com" in url.url


@pytest.mark.asyncio
async def test_get_presigned_url_with_exception():
    with pytest.raises(HTTPException) as excinfo:
        await get_presigned_put_url(bucket_name="os5ml", object_name="object", minio_service=minio_service_mock)
    assert 'status_code=404' in str(excinfo)