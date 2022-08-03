from typing import List

import pytest
from fastapi import HTTPException

from api.controller.objectstore_api_controller import ObjectstoreApiController
from build.openapi_server.apis.objectstore_api import (
    get_all_databags,
    get_databag_by_bucket_name,
    get_databag_by_run_id,
    put_databag_by_bucket_name,
)
from build.openapi_server.models.databag import Databag
from repository.impl.minio_repository import MinioRepository
from tests.mocks.minio_mock import MinioMock

mock_minio_client = MinioMock()
mock_minio_service = MinioRepository(client=mock_minio_client)
mock_objectstore_controller = ObjectstoreApiController(
    storage_service=mock_minio_service
)


@pytest.mark.asyncio
async def test_get_databag_by_bucket_name():
    databag: Databag = await get_databag_by_bucket_name(
        bucket_name="os4ml",
        _controller=mock_objectstore_controller,
    )
    assert type(databag) == Databag


@pytest.mark.asyncio
async def test_get_databag_by_bucket_name_with_exception():
    with pytest.raises(HTTPException) as excinfo:
        await get_databag_by_bucket_name(
            bucket_name="os5ml",
            _controller=mock_objectstore_controller,
        )
    assert "status_code=404" in str(excinfo)


@pytest.mark.asyncio
async def test_get_all_databags():
    databags: List[Databag] = await get_all_databags(
        _controller=mock_objectstore_controller,
    )
    assert type(databags) == list
    assert len(databags) > 0


@pytest.mark.asyncio
async def test_put_databag_by_bucket_name():
    databag: Databag = Databag(bucket_name="os4ml", databag_name="os4ml_db")
    await put_databag_by_bucket_name(
        bucket_name="os4ml",
        databag=databag,
        _controller=mock_objectstore_controller,
    )


@pytest.mark.asyncio
async def test_get_databag_by_run_id():
    databag: Databag = await get_databag_by_run_id(
        run_id="os4ml_unique_run_id",
        _controller=mock_objectstore_controller,
    )
    assert databag.run_id == "os4ml_unique_run_id"


@pytest.mark.asyncio
async def test_get_databag_by_run_id_with_exception():
    with pytest.raises(HTTPException) as excinfo:
        await get_databag_by_run_id(
            run_id="false_os4ml_unique_run_id",
            _controller=mock_objectstore_controller,
        )
    assert "status_code=404" in str(excinfo)
