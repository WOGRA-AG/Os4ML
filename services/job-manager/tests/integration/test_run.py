from typing import List

import pytest

from build.openapi_server.apis.run_api import get_run, get_all_runs, post_run
from build.openapi_server.models.run import Run
from build.openapi_server.models.create_run import CreateRun
from api.run_api_service import RunApiService
from services.kfp_service import KfpService
from mocks.kfp_mock_client import KfpMockClient

mock_kfp_client = KfpMockClient()
mock_kfp_service = KfpService(client=mock_kfp_client)
mock_run_service = RunApiService(kfp_service=mock_kfp_service)


@pytest.mark.asyncio
async def test_get_all_runs():
    experiments: List[Run] = await get_all_runs(_service=mock_run_service)
    assert type(experiments) == list
    assert type(experiments.pop()) == Run


@pytest.mark.asyncio
async def test_post_run():
    params = {"a": "a", "b": "b"}
    create_run: CreateRun = CreateRun(name="abc", description="def", params=params)
    await post_run(_service=mock_run_service, experiment_id="", pipeline_id="", create_run=create_run)


@pytest.mark.asyncio
async def test_get_run():
    await get_run(_service=mock_run_service, run_id="")
