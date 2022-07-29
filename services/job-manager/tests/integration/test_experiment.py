from typing import List

import pytest
from mocks.kfp_mock_client import KfpMockClient

from api.controller.jobmanager_api_controller import JobmanagerApiController
from build.openapi_server.apis.jobmanager_api import (
    get_all_experiments,
    post_experiment,
)
from build.openapi_server.models.experiment import Experiment
from executor.kfp_service import KfpService
from services.solution_service import SolutionService
from services.template_service import TemplateService

mock_kfp_client = KfpMockClient()
mock_kfp_service = KfpService(client=mock_kfp_client)
mock_solution_service = SolutionService(kfp_client=mock_kfp_client)
mock_template_service = TemplateService(kfp_client=mock_kfp_client)
mock_jobmanager_controller = JobmanagerApiController(
    kfp_service=mock_kfp_service,
    solution_service=mock_solution_service,
    template_service=mock_template_service,
)


@pytest.mark.asyncio
async def test_get_all_experiments():
    experiments: List[Experiment] = await get_all_experiments(
        _controller=mock_jobmanager_controller
    )
    assert type(experiments) == list
    assert type(experiments.pop()) == Experiment


@pytest.mark.asyncio
async def test_post_experiment():
    create_experiment: Experiment = Experiment(name="", description="")
    await post_experiment(
        experiment=create_experiment, _controller=mock_jobmanager_controller
    )
