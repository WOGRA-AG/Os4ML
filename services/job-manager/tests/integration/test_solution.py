import pytest
from fastapi import HTTPException
from pytest_mock import MockerFixture

from src.api.routers.solution_router import (
    get_solution,
    post_solution,
    put_solution,
)
from src.models import Solution
from src.services.solution_service import SolutionService
from tests.mocks.kfp_mock_client import KfpMockClient

kfp_mock = KfpMockClient()
solution_service = SolutionService(kfp_client=kfp_mock)


@pytest.mark.asyncio
async def test_get_solution(mocker: MockerFixture):
    solutions = [Solution(name="solution_1"), Solution(name="other2")]
    mocker.patch.object(
        solution_service.objectstore,
        "get_all_solutions",
        return_value=solutions,
    )

    solution: Solution = await get_solution(
        solution_name="solution_1", solution_service=solution_service
    )

    assert type(solution) == Solution
    assert solution.name == "solution_1"


@pytest.mark.asyncio
async def test_get_solution_not_found(mocker: MockerFixture):
    solutions = [Solution(name="other1"), Solution(name="other2")]
    mocker.patch.object(
        solution_service.objectstore,
        "get_all_solutions",
        return_value=solutions,
    )

    with pytest.raises(HTTPException) as e:
        await get_solution(
            solution_name="solution_1", solution_service=solution_service
        )

    assert e.errisinstance(HTTPException)
    assert e.value.status_code == 404


@pytest.mark.asyncio
async def test_update_solution(mocker: MockerFixture):
    solution = Solution(name="solution")
    put_object_mock = mocker.patch.object(
        solution_service.objectstore, "put_object_by_name"
    )

    returned_solution: Solution = await put_solution(
        solution_name="solution",
        solution=solution,
        solution_service=solution_service,
    )

    assert solution == returned_solution
    put_object_mock.assert_called_once()


@pytest.mark.asyncio
async def test_update_solution_with_other_name(mocker: MockerFixture):
    solution = Solution(name="solution")
    updated_solution = Solution(name="updated_name")
    mocker.patch.object(
        solution_service.objectstore,
        "get_all_solutions",
        return_value=[solution],
    )
    delete_object_mock = mocker.patch.object(
        solution_service.objectstore, "delete_object_by_name"
    )
    put_object_mock = mocker.patch.object(
        solution_service.objectstore, "put_object_by_name"
    )

    returned_solution: Solution = await put_solution(
        solution_name="solution",
        solution=updated_solution,
        solution_service=solution_service,
    )

    assert updated_solution == returned_solution
    put_object_mock.assert_called_once()
    delete_object_mock.assert_called_once()


@pytest.mark.asyncio
async def test_post_solution(mocker: MockerFixture):
    solution = Solution(name="solution", bucket_name="bucket")

    databag = mocker.MagicMock()
    databag.bucket_name = "bucket"
    databag.file_name = "file_name"
    mocker.patch.object(
        solution_service.objectstore,
        "get_databag_by_bucket_name",
        return_value=databag,
    )
    put_object_mock = mocker.patch.object(
        solution_service.objectstore, "put_object_by_name"
    )
    run_mock = mocker.patch.object(
        solution_service.template_service,
        "run_pipeline_template",
        return_value=1,
    )

    run_id: str = await post_solution(
        solution=solution, solution_service=solution_service
    )

    assert run_id == 1
    assert put_object_mock.call_count == 2
    run_mock.assert_called_once()
