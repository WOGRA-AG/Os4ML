from typing import List

import pytest
from mocks.kfp_mock_client import KfpMockClient

from api.pipeline_api_service import PipelineApiService
from build.openapi_server.apis.pipeline_api import (
    get_all_pipelines,
    post_pipeline,
)
from build.openapi_server.models.create_pipeline import (
    CreatePipeline,
    Pipeline,
)
from services.kfp_service import KfpService

mock_kfp_client = KfpMockClient()
mock_kfp_service = KfpService(client=mock_kfp_client)
mock_pipeline_service = PipelineApiService(kfp_service=mock_kfp_service)


@pytest.mark.asyncio
async def test_get_all_pipelines():
    experiments: List[Pipeline] = await get_all_pipelines(
        _service=mock_pipeline_service
    )
    assert type(experiments) == list
    assert type(experiments.pop()) == Pipeline


@pytest.mark.asyncio
async def test_post_pipeline():
    test_url: str = "https://raw.githubusercontent.com/kubeflow/pipelines/ef6e01c90c2c88606a0ad56d848ecc98609410c3/components/kubeflow/dnntrainer/component.yaml"
    create_pipeline: CreatePipeline = CreatePipeline(
        name="abc", description="def", config_url=test_url
    )
    await post_pipeline(
        _service=mock_pipeline_service, create_pipeline=create_pipeline
    )
