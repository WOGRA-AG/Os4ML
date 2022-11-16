import pytest
from mocks.kfp_mock_client import KfpMockClient
from pytest_mock import MockerFixture

from api.controller.jobmanager_api_controller import JobmanagerApiController
from build.openapi_server.apis.jobmanager_api import (
    create_run_by_solver_name,
    get_run_by_id,
)
from build.openapi_server.models.run_params import RunParams
from executor.kfp_executor import KfpExecutor
from services.run_service import RunService


@pytest.fixture
def mock_workflowtranslator_api(mocker: MockerFixture):
    return mocker.Mock()


@pytest.fixture
def mock_kfp_executor() -> KfpExecutor:
    mock_kfp_client = KfpMockClient()
    return KfpExecutor(client=mock_kfp_client)


@pytest.fixture
def mock_jobmanager_controller(mock_workflowtranslator_api, mock_kfp_executor):
    mock_run_service = RunService(
        kfp_executor=mock_kfp_executor,
        workflowtranslator=mock_workflowtranslator_api,
    )
    return JobmanagerApiController(
        run_service=mock_run_service,
    )


@pytest.mark.asyncio
async def test_post_run(
    mock_jobmanager_controller, mock_workflowtranslator_api, usertoken
):
    run_params = RunParams(
        databag_id="test-databag", solution_name="test-solution"
    )
    mock_workflowtranslator_api.get_pipeline_template_by_name.return_value = {
        "pipe": "line"
    }
    await create_run_by_solver_name(
        solver_name="ludwig-solver",
        usertoken=usertoken,
        run_params=run_params,
        _controller=mock_jobmanager_controller,
    )


@pytest.mark.asyncio
async def test_get_run(mock_jobmanager_controller):
    await get_run_by_id(_controller=mock_jobmanager_controller, run_id="")
