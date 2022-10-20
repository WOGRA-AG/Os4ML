import base64
import json
from typing import Any

import pytest
from conftest import user_header
from fastapi import HTTPException
from mocks.kfp_mock_client import KfpMockClient
from pytest_mock import MockerFixture

from api.controller.jobmanager_api_controller import JobmanagerApiController
from build.objectstore_client.api.objectstore_api import ObjectstoreApi
from build.objectstore_client.model.item import Item
from build.objectstore_client.model.json_response import JsonResponse
from build.openapi_server.apis.jobmanager_api import (
    get_all_solutions,
    get_solution,
    post_solution,
    put_solution,
)
from build.openapi_server.models.solution import Solution
from build.openapi_server.models.user import User
from executor.kfp_executor import KfpExecutor
from services.solution_service import SolutionService
from services.template_service import TemplateService

mock_kfp_client = KfpMockClient()
mock_kfp_service = KfpExecutor(client=mock_kfp_client)
mock_solution_service = SolutionService(kfp_client=mock_kfp_client)
mock_template_service = TemplateService(kfp_client=mock_kfp_client)
mock_jobmanager_controller = JobmanagerApiController(
    kfp_service=mock_kfp_service,
    solution_service=mock_solution_service,
    template_service=mock_template_service,
    user=User(id="default", email="email", raw_token=""),
)


class TestSolution(Solution):
    def __init__(self, name, **data: Any):
        super().__init__(**data)
        self.name = name

    def to_dict(self):
        return {"name": self.name}


@pytest.mark.asyncio
async def test_get_all_solutions(mocker: MockerFixture):
    objects_mock = mocker.MagicMock(
        side_effect=[
            [
                Item("test-1", "solution.json"),
                Item("test-2", "not-a-solution"),
                Item("test-2", "solution.json"),
            ],
        ]
    )
    mocker.patch.object(ObjectstoreApi, "get_objects", objects_mock)
    solution1_json = {
        "name": "test-solution-1",
        "status": "test",
        "bucket_name": "test-1",
        "databag_id": "test-1",
    }
    solution1_encoded = base64.encodebytes(
        json.dumps(solution1_json).encode()
    ).decode()
    solution2_json = {
        "name": "test-solution-2",
        "status": "test",
        "bucket_name": "test-2",
        "databag_id": "test-2",
    }
    solution2_encoded = base64.encodebytes(
        json.dumps(solution2_json).encode()
    ).decode()
    json_objects_mock = mocker.MagicMock(
        side_effect=[
            JsonResponse(json_content=solution1_encoded),
            JsonResponse(json_content=solution2_encoded),
        ]
    )
    mocker.patch.object(
        ObjectstoreApi, "get_json_object_by_name", json_objects_mock
    )

    solutions = await get_all_solutions(
        _controller=mock_jobmanager_controller,
        usertoken=user_header.get("usertoken"),
    )

    json_objects_mock.assert_called()
    assert json_objects_mock.call_count == 2
    solution1 = Solution(
        name="test-solution-1",
        status="test",
        bucket_name="test-1",
        databag_id="test-1",
    )
    assert solution1 in solutions
    solution2 = Solution(
        name="test-solution-2",
        status="test",
        bucket_name="test-2",
        databag_id="test-2",
    )
    assert solution2 in solutions
    assert len(solutions) == 2


@pytest.mark.asyncio
async def test_get_solution(mocker: MockerFixture):
    solutions = [TestSolution(name="solution_1"), TestSolution(name="other2")]
    mocker.patch.object(
        mock_solution_service,
        "get_all_solutions",
        return_value=solutions,
    )

    solution: Solution = await get_solution(
        solution_name="solution_1",
        _controller=mock_jobmanager_controller,
        usertoken=user_header.get("usertoken"),
    )

    assert solution.name == "solution_1"


@pytest.mark.asyncio
async def test_get_solution_not_found(mocker: MockerFixture):
    solutions = [TestSolution(name="other1"), TestSolution(name="other2")]
    mocker.patch.object(
        mock_solution_service,
        "get_all_solutions",
        return_value=solutions,
    )

    with pytest.raises(HTTPException) as e:
        await get_solution(
            solution_name="solution_1",
            _controller=mock_jobmanager_controller,
            usertoken=user_header.get("usertoken"),
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
        _controller=mock_jobmanager_controller,
        usertoken=user_header.get("usertoken"),
    )

    assert solution == returned_solution
    put_object_mock.assert_called_once()


@pytest.mark.asyncio
async def test_post_solution(mocker: MockerFixture):
    solution = Solution(name="solution", bucket_name="bucket")

    databag = mocker.MagicMock()
    databag.bucket_name = "bucket"
    databag.databag_id = "test-1"
    databag.file_name = "file_name"
    mocker.patch.object(
        mock_solution_service.objectstore,
        "get_databag_by_id",
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
        solution=solution,
        _controller=mock_jobmanager_controller,
        usertoken=user_header.get("usertoken"),
    )

    assert run_id == 1
    assert put_object_mock.call_count == 2
    run_mock.assert_called_once()
