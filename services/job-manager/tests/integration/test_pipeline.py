from typing import List

import pytest
from mocks.kfp_mock_client import KfpMockClient

from api.controller.jobmanager_api_controller import JobmanagerApiController
from build.openapi_server.apis.jobmanager_api import (
    create_pipeline,
    get_pipelines,
)
from build.openapi_server.models.create_pipeline import (
    CreatePipeline,
    Pipeline,
)
from build.openapi_server.models.user import User
from executor.kfp_executor import KfpExecutor
from services.run_service import RunService

mock_kfp_client = KfpMockClient()
mock_kfp_service = KfpExecutor(client=mock_kfp_client)
mock_template_service = RunService(kfp_client=mock_kfp_client)
mock_jobmanager_controller = JobmanagerApiController(
    kfp_service=mock_kfp_service,
    template_service=mock_template_service,
    user=User(id="default", email="email", raw_token=""),
)


@pytest.mark.asyncio
async def test_get_all_pipelines():
    experiments: List[Pipeline] = await get_pipelines(
        _controller=mock_jobmanager_controller
    )
    assert type(experiments) == list
    assert type(experiments.pop()) == Pipeline


@pytest.mark.asyncio
async def test_post_pipeline():
    test_url: str = "https://raw.githubusercontent.com/kubeflow/pipelines/ef6e01c90c2c88606a0ad56d848ecc98609410c3/components/kubeflow/dnntrainer/component.yaml"
    cp: CreatePipeline = CreatePipeline(
        name="abc", description="def", config_url=test_url
    )
    await create_pipeline(
        _controller=mock_jobmanager_controller, create_pipeline=cp
    )
