from typing import List

import pytest

from src.api.routers.experiment_router import (
    get_all_experiments,
    post_experiment,
)
from src.models import Experiment
from src.services.kfp_service import KfpService
from tests.mocks.kfp_mock_client import KfpMockClient

mock_client = KfpMockClient()
mock_service = KfpService(client=mock_client)


@pytest.mark.asyncio
async def test_get_all_experiments():
    experiments: List[Experiment] = await get_all_experiments(
        kfp_service=mock_service
    )
    assert type(experiments) == list
    assert type(experiments.pop()) == Experiment


@pytest.mark.asyncio
async def test_post_experiment():
    create_experiment: Experiment = Experiment(name="", description="")
    await post_experiment(
        experiment=create_experiment, kfp_service=mock_service
    )
