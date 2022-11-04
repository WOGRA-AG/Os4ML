from typing import List

import pytest
from mocks.kfp_mock_client import KfpMockClient

from api.controller.jobmanager_api_controller import JobmanagerApiController
from build.openapi_server.apis.jobmanager_api import (
    create_run,
    get_run_by_id,
    get_runs,
)
from build.openapi_server.models.create_run import CreateRun
from build.openapi_server.models.run import Run
from build.openapi_server.models.user import User
from executor.kfp_executor import KfpExecutor
from services.template_service import TemplateService

mock_kfp_client = KfpMockClient()
mock_kfp_service = KfpExecutor(client=mock_kfp_client)
mock_template_service = TemplateService(kfp_client=mock_kfp_client)
mock_jobmanager_controller = JobmanagerApiController(
    kfp_service=mock_kfp_service,
    template_service=mock_template_service,
    user=User(id="default", email="email", raw_token=""),
)


@pytest.mark.asyncio
async def test_get_all_runs():
    experiments: List[Run] = await get_runs(
        _controller=mock_jobmanager_controller
    )
    assert type(experiments) == list
    assert type(experiments.pop()) == Run


@pytest.mark.asyncio
async def test_post_run():
    params = {"a": "a", "b": "b"}
    cr: CreateRun = CreateRun(name="abc", description="def", params=params)
    await create_run(
        _controller=mock_jobmanager_controller,
        experiment_id="",
        pipeline_id="",
        create_run=cr,
    )


@pytest.mark.asyncio
async def test_get_run():
    await get_run_by_id(_controller=mock_jobmanager_controller, run_id="")
