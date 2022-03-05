from typing import List

import pytest
from fastapi import HTTPException

from src.api.routers.template_router import (
    get_all_component_templates,
    get_all_pipeline_templates,
    get_component_template_by_name,
    get_pipeline_template_by_name,
)
from src.models import PipelineTemplate
from src.services.minio_service import MinioService
from tests.mocks.minio_mock import MinioMock

minio_mock_client = MinioMock()
minio_service_mock = MinioService(client=minio_mock_client)


@pytest.mark.asyncio
async def test_get_all_pipeline_templates():
    templates: List[PipelineTemplate] = await get_all_pipeline_templates(minio_service_mock)
    assert type(templates) == list
    assert len(templates) > 0
    assert type(templates.pop()) == PipelineTemplate


@pytest.mark.asyncio
async def test_get_all_pipeline_templates():
    templates: List[PipelineTemplate] = await get_all_component_templates(minio_service_mock)
    assert type(templates) == list
    assert len(templates) > 0
    assert type(templates.pop()) == PipelineTemplate


@pytest.mark.asyncio
async def test_get_pipeline_by_name():
    template: PipelineTemplate = await get_pipeline_template_by_name(
        pipeline_name="pipeline", minio_service=minio_service_mock
    )
    assert type(template) == PipelineTemplate


@pytest.mark.asyncio
async def test_get_pipeline_by_name_with_exception():
    with pytest.raises(HTTPException) as excinfo:
        await get_pipeline_template_by_name(pipeline_name="pipeline_err", minio_service=minio_service_mock)
    assert "status_code=404" in str(excinfo)


@pytest.mark.asyncio
async def test_get_component_by_name():
    template: PipelineTemplate = await get_component_template_by_name(
        component_name="component", minio_service=minio_service_mock
    )
    assert type(template) == PipelineTemplate


@pytest.mark.asyncio
async def test_get_component_by_name_with_exception():
    with pytest.raises(HTTPException) as excinfo:
        await get_component_template_by_name(component_name="component_err", minio_service=minio_service_mock)
    assert "status_code=404" in str(excinfo)
