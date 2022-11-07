import json
import pathlib

import pytest
from conftest import user_header
from fastapi import HTTPException
from pytest_mock import MockerFixture

import services
from api.controller.jobmanager_api_controller import JobmanagerApiController
from build.openapi_server.apis.jobmanager_api import run_template
from build.openapi_server.models.run_params import RunParams
from build.openapi_server.models.user import User
from build.translator_client.api.workflowtranslator_api import (
    WorkflowtranslatorApi,
)
from services.run_service import RunService


@pytest.fixture
def mock_kfp_client(mocker):
    return mocker.Mock()


@pytest.fixture
def template_service(mock_kfp_client):
    return RunService(kfp_client=mock_kfp_client)


@pytest.fixture
def jobmanager_api_service(template_service, mock_kfp_client):
    return JobmanagerApiController(
        template_service=template_service,
        kfp_service=mock_kfp_client,
        user=User(id="default", email="email", raw_token=""),
    )


@pytest.mark.asyncio
async def test_post_template(
    mocker,
    mock_kfp_client,
    jobmanager_api_service,
    template_service,
    usertoken,
):
    experiment_id = mocker.Mock(id="experiment_id")
    pipeline_id = mocker.Mock(id="pipeline_id")
    run_id = mocker.Mock(id="run_id")
    mock_kfp_client.create_experiment = mocker.Mock(return_value=experiment_id)
    mock_kfp_client.upload_pipeline = mocker.Mock(return_value=pipeline_id)
    mock_kfp_client.run_pipeline = mocker.Mock(return_value=run_id)
    run_id: str = await run_template(
        pipeline_template_name="test-pipeline",
        run_params=RunParams(),
        _controller=jobmanager_api_service,
        usertoken=usertoken,
    )
    assert run_id == "run_id"
    call = mock_kfp_client.run_pipeline.call_args[1]
    assert call["experiment_id"] == "experiment_id"
    assert "test-pipeline" in call["job_name"]
    assert call["pipeline_id"] == "pipeline_id"
    assert call["params"]["os4ml_namespace"] == "os4ml"
