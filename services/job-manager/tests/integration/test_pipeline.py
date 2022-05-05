from typing import List

import pytest

from src.api.routers.pipeline_router import get_all_pipelines, post_pipeline
from src.models import CreatePipeline, Pipeline
from src.services.kfp_service import KfpService
from tests.mocks.kfp_mock_client import KfpMockClient

mock_client = KfpMockClient()
mock_service = KfpService(client=mock_client)


@pytest.mark.asyncio
async def test_get_all_pipelines():
    experiments: List[Pipeline] = await get_all_pipelines(
        kfp_service=mock_service
    )
    assert type(experiments) == list
    assert type(experiments.pop()) == Pipeline


@pytest.mark.asyncio
async def test_post_pipeline():
    test_url: str = "https://github.com/kubeflow/pipelines/blob/ef6e01c90c2c88606a0ad56d848ecc98609410c3/components/kubeflow/dnntrainer/component.yaml"
    create_pipeline: CreatePipeline = CreatePipeline(
        name="abc", description="def", config_url=test_url
    )
    await post_pipeline(create_pipeline, kfp_service=mock_service)
