from typing import List

import pytest
from services.kfp_service import KfpService
from mocks.kfp_mock_client import KfpMockClient

from api.experiment_api_service import ExperimentApiService
from build.openapi_server.apis.experiment_api import get_all_experiments, post_experiment
from build.openapi_server.models.experiment import Experiment

mock_kfp_client = KfpMockClient()
mock_kfp_service = KfpService(client=mock_kfp_client)
mock_experiment_service = ExperimentApiService(kfp_service=mock_kfp_service)


@pytest.mark.asyncio
async def test_get_all_experiments():
    experiments: List[Experiment] = await get_all_experiments(_service=mock_experiment_service)
    assert type(experiments) == list
    assert type(experiments.pop()) == Experiment


@pytest.mark.asyncio
async def test_post_experiment():
    create_experiment: Experiment = Experiment(name="", description="")
    await post_experiment(_service=mock_experiment_service, experiment=create_experiment)
