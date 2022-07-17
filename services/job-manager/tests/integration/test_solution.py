from typing import Any

import pytest
from fastapi import HTTPException
from mocks.kfp_mock_client import KfpMockClient
from pytest_mock import MockerFixture

from api.solution_api_service import SolutionApiService
from build.openapi_client.api.objectstore_api import ObjectstoreApi
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


class TestSolution(Solution):
    def __init__(self, name, **data: Any):
        super().__init__(**data)
        self.name = name

    def to_dict(self):
        return {"name": self.name}


@pytest.mark.asyncio
async def test_get_solution(mocker: MockerFixture):
    solutions = [TestSolution(name="solution_1"), TestSolution(name="other2")]
    mocker.patch.object(
        ObjectstoreApi,
        "get_all_solutions",
        return_value=solutions,
    )

    solution: Solution = await get_solution(
        solution_name="solution_1", _service=mock_api_service
    )

    assert solution.name == "solution_1"


@pytest.mark.asyncio
async def test_get_solution_not_found(mocker: MockerFixture):
    solutions = [TestSolution(name="other1"), TestSolution(name="other2")]
    mocker.patch.object(
        ObjectstoreApi,
        "get_all_solutions",
        return_value=solutions,
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
        solution_name="solution",
        solution=solution,
        _service=mock_api_service,
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
