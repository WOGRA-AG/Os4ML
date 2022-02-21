from typing import List

import pytest

from src.api.routers.run_router import get_all_runs, get_run, post_run
from src.models import CreateRun, Run
from src.services.kfp_service import KfpService
from tests.mocks.kfp_mock_client import KfpMockClient

mock_client = KfpMockClient()
mock_service = KfpService(client=mock_client)


@pytest.mark.asyncio
async def test_get_all_runs():
    experiments: List[Run] = await get_all_runs(kfp_service=mock_service)
    assert type(experiments) == list
    assert type(experiments.pop()) == Run


@pytest.mark.asyncio
async def test_post_run():
    params = {"a": "a", "b": "b"}
    create_run: CreateRun = CreateRun(name="abc", description="def", params=params)
    await post_run(experiment_id="", pipeline_id="", run=create_run, kfp_service=mock_service)


@pytest.mark.asyncio
async def test_get_run():
    await get_run(run_id="", kfp_service=mock_service)
