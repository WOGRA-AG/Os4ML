import pytest
import requests
from fastapi import HTTPException
from mocks.kfp_mock_client import KfpMockClient
from pytest_mock import MockerFixture

from api.solution_api_service import SolutionApiService
from build.openapi_server.apis.solution_api import (
    get_solution,
    post_solution,
    put_solution,
)
from build.openapi_server.models.solution import Solution
from services.solution_service import SolutionService

mock_kfp_client = KfpMockClient()
mock_solution_service = SolutionService(kfp_client=mock_kfp_client)
mock_api_service = SolutionApiService(solution_service=mock_solution_service)


@pytest.mark.asyncio
async def test_get_solution(mocker: MockerFixture):
    solutions = [{"name": "solution_1"}, {"name": "other2"}]
    get_mock = mocker.MagicMock(json=lambda: solutions)
    mocker.patch.object(
        requests, "get", return_value=get_mock,
    )

    solution: Solution = await get_solution(
        solution_name="solution_1", _service=mock_api_service
    )

    assert solution["name"] == "solution_1"


@pytest.mark.asyncio
async def test_get_solution_not_found(mocker: MockerFixture):
    solutions = [{"name": "other1"}, {"name": "other2"}]
    get_mock = mocker.MagicMock(json=lambda: solutions)
    mocker.patch.object(
        requests, "get", return_value=get_mock,
    )

    with pytest.raises(HTTPException) as e:
        await get_solution(
            solution_name="solution_1", _service=mock_api_service
        )

    assert e.errisinstance(HTTPException)
    assert e.value.status_code == 404


@pytest.mark.asyncio
async def test_update_solution(mocker: MockerFixture):
    solution = Solution(name="solution")
    put_object_mock = mocker.patch.object(
        mock_solution_service.objectstore, "put_object_by_name"
    )

    returned_solution: Solution = await put_solution(
        solution_name="solution", solution=solution, _service=mock_api_service,
    )

    assert solution == returned_solution
    put_object_mock.assert_called_once()


@pytest.mark.asyncio
async def test_post_solution(mocker: MockerFixture):
    solution = Solution(name="solution", bucket_name="bucket")

    databag = mocker.MagicMock()
    databag.bucket_name = "bucket"
    databag.file_name = "file_name"
    mocker.patch.object(
        mock_solution_service.objectstore,
        "get_databag_by_bucket_name",
        return_value=databag,
    )
    put_object_mock = mocker.patch.object(
        mock_solution_service.objectstore, "put_object_by_name"
    )
    run_mock = mocker.patch.object(
        mock_solution_service.template_service,
        "run_pipeline_template",
        return_value=1,
    )

    run_id: str = await post_solution(
        solution=solution, _service=mock_api_service
    )

    assert run_id == 1
    assert put_object_mock.call_count == 2
    run_mock.assert_called_once()
