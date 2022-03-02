from typing import List

import pytest
from fastapi import HTTPException

from src.api.routers.databag_router import get_all_databags, get_databag_by_bucket_name, put_databag_by_bucket_name
from src.models import Databag
from src.services.minio_service import MinioService
from tests.mocks.minio_mock import MinioMock

minio_mock_client = MinioMock()
minio_service_mock = MinioService(client=minio_mock_client)


@pytest.mark.asyncio
async def test_get_databag_by_bucket_name():
    databag: Databag = Databag(
        **(await get_databag_by_bucket_name(bucket_name="os4ml", minio_service=minio_service_mock))
    )
    assert type(databag) == Databag


@pytest.mark.asyncio
async def test_get_databag_by_bucket_name_with_exception():
    with pytest.raises(HTTPException) as excinfo:
        await get_databag_by_bucket_name(bucket_name="os5ml", minio_service=minio_service_mock)
    assert "status_code=404" in str(excinfo)


@pytest.mark.asyncio
async def test_get_databag_by_bucket_name_with_exception():
    with pytest.raises(HTTPException) as excinfo:
        await get_databag_by_bucket_name(bucket_name="os6ml", minio_service=minio_service_mock)
    assert "status_code=400" in str(excinfo)


@pytest.mark.asyncio
async def test_get_all_databags():
    databags: List[Databag] = [
        Databag(**databag) for databag in await get_all_databags(minio_service=minio_service_mock)
    ]
    assert type(databags) == list
    assert len(databags) > 0


@pytest.mark.asyncio
async def test_put_databag_by_bucket_name():
    databag: Databag = Databag(bucket_name="os4ml", databag_name="os4ml_db")
    await put_databag_by_bucket_name(bucket_name="os4ml", databag=databag, minio_service=minio_service_mock)
