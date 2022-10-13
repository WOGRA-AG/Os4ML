from typing import List

import pytest
from mocks.kfp_mock_client import KfpMockClient

from api.controller.jobmanager_api_controller import JobmanagerApiController
from build.openapi_server.apis.jobmanager_api import (
    get_all_runs,
    get_run,
    post_run,
)
from build.openapi_server.models.create_run import CreateRun
from build.openapi_server.models.run import Run
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
async def test_get_all_runs():
    experiments: List[Run] = await get_all_runs(
        _controller=mock_jobmanager_controller
    )
    assert type(experiments) == list
    assert type(experiments.pop()) == Run


@pytest.mark.asyncio
async def test_post_run():
    params = {"a": "a", "b": "b"}
    create_run: CreateRun = CreateRun(
        name="abc", description="def", params=params
    )
    await post_run(
        _controller=mock_jobmanager_controller,
        experiment_id="",
        pipeline_id="",
        create_run=create_run,
    )


@pytest.mark.asyncio
async def test_get_run():
    await get_run(_controller=mock_jobmanager_controller, run_id="")
