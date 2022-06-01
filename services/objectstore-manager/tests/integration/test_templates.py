from typing import List

import pytest
from fastapi import HTTPException

from api.template_api_service import TemplateApiService
from build.openapi_server.apis.template_api import (
    get_all_component_templates,
    get_all_pipeline_templates,
    get_component_template_by_name,
    get_pipeline_template_by_name,
)
from build.openapi_server.models.pipeline_template import PipelineTemplate
from services.minio_service import MinioService
from tests.mocks.minio_mock import MinioMock

mock_minio_client = MinioMock()
mock_minio_service = MinioService(client=mock_minio_client)
mock_template_api_service = TemplateApiService(
    minio_service=mock_minio_service)


@pytest.mark.asyncio
async def test_get_all_pipeline_templates():
    templates: List[PipelineTemplate] = await get_all_pipeline_templates(
        _service=mock_template_api_service,
    )
    assert type(templates) == list
    assert len(templates) > 0
    assert type(templates.pop()) == PipelineTemplate


@pytest.mark.asyncio
async def test_get_all_pipeline_templates():
    templates: List[PipelineTemplate] = await get_all_component_templates(
        _service=mock_template_api_service,
    )
    assert type(templates) == list
    assert len(templates) > 0
    assert type(templates.pop()) == PipelineTemplate


@pytest.mark.asyncio
async def test_get_pipeline_by_name():
    template: PipelineTemplate = await get_pipeline_template_by_name(
        pipeline_name="pipeline",
        _service=mock_template_api_service,
    )
    assert type(template) == PipelineTemplate


@pytest.mark.asyncio
async def test_get_pipeline_by_name_with_exception():
    with pytest.raises(HTTPException) as excinfo:
        await get_pipeline_template_by_name(
            pipeline_name="pipeline_err",
            _service=mock_template_api_service,
        )
    assert "status_code=404" in str(excinfo)


@pytest.mark.asyncio
async def test_get_component_by_name():
    template: PipelineTemplate = await get_component_template_by_name(
        component_name="component",
        _service=mock_template_api_service,
    )
    assert type(template) == PipelineTemplate


@pytest.mark.asyncio
async def test_get_component_by_name_with_exception():
    with pytest.raises(HTTPException) as excinfo:
        await get_component_template_by_name(
            component_name="component_err",
            _service=mock_template_api_service,
        )
    assert "status_code=404" in str(excinfo)
