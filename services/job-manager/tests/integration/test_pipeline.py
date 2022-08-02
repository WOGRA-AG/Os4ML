from typing import List

import pytest
from mocks.kfp_mock_client import KfpMockClient

from api.controller.jobmanager_api_controller import JobmanagerApiController
from build.openapi_server.apis.jobmanager_api import (
    get_all_pipelines,
    post_pipeline,
)
from build.openapi_server.models.create_pipeline import (
    CreatePipeline,
    Pipeline,
)
from executor.kfp_executor import KfpExecutor
from services.solution_service import SolutionService
from services.template_service import TemplateService

mock_kfp_client = KfpMockClient()
mock_kfp_service = KfpExecutor(client=mock_kfp_client)
mock_solution_service = SolutionService(kfp_client=mock_kfp_client)
mock_template_service = TemplateService(kfp_client=mock_kfp_client)
mock_jobmanager_controller = JobmanagerApiController(
    kfp_service=mock_kfp_service,
    solution_service=mock_solution_service,
    template_service=mock_template_service,
)


@pytest.mark.asyncio
async def test_get_all_pipelines():
    experiments: List[Pipeline] = await get_all_pipelines(
        _controller=mock_jobmanager_controller
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
        _controller=mock_jobmanager_controller, create_pipeline=create_pipeline
    )
