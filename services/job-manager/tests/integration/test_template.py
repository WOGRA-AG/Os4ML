import json
import pathlib

import pytest
from fastapi import HTTPException

import services
from api.template_api_service import TemplateApiService
from build.openapi_server.apis.template_api import (
    get_all_pipeline_templates,
    get_pipeline_file_by_name,
    get_pipeline_template_by_name,
    post_template,
)
from build.openapi_server.models.run_params import RunParams
from services.template_service import TemplateService


@pytest.fixture
def mock_kfp_client(mocker):
    return mocker.Mock()


@pytest.fixture
def template_service(mock_kfp_client):
    return TemplateService(kfp_client=mock_kfp_client)


@pytest.fixture
def template_api_service(template_service):
    return TemplateApiService(template_service=template_service)


@pytest.mark.asyncio
async def test_post_template(
    mocker, mock_kfp_client, template_api_service, template_service
):
    mocker.patch.object(
        template_service,
        "get_pipeline_file_path",
        return_value="/tmp/pipeline.yaml",
    )
    experiment_id = mocker.Mock(id="experiment_id")
    pipeline_id = mocker.Mock(id="pipeline_id")
    run_id = mocker.Mock(id="run_id")
    mock_kfp_client.create_experiment = mocker.Mock(return_value=experiment_id)
    mock_kfp_client.upload_pipeline = mocker.Mock(return_value=pipeline_id)
    mock_kfp_client.run_pipeline = mocker.Mock(return_value=run_id)
    run_id: str = await post_template(
        "test-pipeline", RunParams(), _service=template_api_service
    )
    assert run_id == "run_id"
    call = mock_kfp_client.run_pipeline.call_args[1]
    assert call["experiment_id"] == "experiment_id"
    assert "test-pipeline" in call["job_name"]
    assert call["pipeline_id"] == "pipeline_id"
    assert call["params"]["os4ml_namespace"] == "os4ml"


@pytest.fixture
def mock_templates_dir(tmp_path):
    test_pipeline_dir = tmp_path / "test-pipeline"
    test_pipeline_dir.mkdir()

    pipeline_file = test_pipeline_dir / "pipeline.yaml"
    pipeline_file.touch()

    metadata_file = test_pipeline_dir / "metadata.json"
    metadata_file.touch()
    metadata = {
        "name": "test-pipeline",
        "description": "test",
        "type": "pipeline",
        "pipeline_step": "pipeline",
    }
    with open(metadata_file, "w") as f:
        json.dump(metadata, f)
    return tmp_path


@pytest.mark.asyncio
async def test_get_all_pipeline_templates(
    monkeypatch, template_api_service, mock_templates_dir
):
    monkeypatch.setattr(
        services.template_service,
        "PIPELINE_TEMPLATES_DIR",
        str(mock_templates_dir),
    )
    pipelines = await get_all_pipeline_templates(template_api_service)
    pipeline = pipelines[0]
    assert pipeline.name == "test-pipeline"
    assert pipeline.description == "test"
    assert pipeline.type == "pipeline"
    assert pipeline.pipeline_step == "pipeline"


# works only on the dockerfile
# create pipelines and change PIPELINES_TEMPLATES_DIR to run locally
@pytest.mark.asyncio
async def test_get_all_pipeline_templates_ludwig_solver_exists(
    template_api_service,
):
    pipelines = await get_all_pipeline_templates(template_api_service)
    assert any(pipeline.name == "ludwig-solver" for pipeline in pipelines)
    ludwig_solver = next(iter(
        pipeline for pipeline in pipelines if pipeline.name == "ludwig-solver"
    ))
    assert ludwig_solver.name == "ludwig-solver"
    assert ludwig_solver.description
    assert ludwig_solver.type == "pipeline"
    assert ludwig_solver.pipeline_step == "solver"


# works only on the dockerfile
# create pipelines and change PIPELINES_TEMPLATES_DIR to run locally
@pytest.mark.asyncio
async def test_get_all_pipeline_templates_init_pipeline_exists(
    template_api_service,
):
    pipelines = await get_all_pipeline_templates(template_api_service)
    assert any(
        pipeline.name == "init-databag-sniffle-upload"
        for pipeline in pipelines
    )
    init_pipeline = first(
        pipeline
        for pipeline in pipelines
        if pipeline.name == "init-databag-sniffle-upload"
    )
    assert init_pipeline.name
    assert init_pipeline.description
    assert init_pipeline.type == "pipeline"
    assert init_pipeline.pipeline_step == "prepare"


@pytest.mark.asyncio
async def test_get_pipeline_file_by_name(
    monkeypatch, template_api_service, mock_templates_dir
):
    monkeypatch.setattr(
        services.template_service,
        "PIPELINE_TEMPLATES_DIR",
        str(mock_templates_dir),
    )
    pipeline_file = await get_pipeline_file_by_name(
        "test-pipeline", template_api_service
    )
    assert "pipeline.yaml" == pathlib.Path(pipeline_file.path).name


@pytest.mark.asyncio
async def test_get_pipeline_file_by_name_not_found(
    monkeypatch, template_api_service, mock_templates_dir
):
    monkeypatch.setattr(
        services.template_service,
        "PIPELINE_TEMPLATES_DIR",
        str(mock_templates_dir),
    )
    with pytest.raises(HTTPException):
        await get_pipeline_file_by_name(
            "this-pipeline-does-not-exist", template_api_service
        )


@pytest.mark.asyncio
async def test_get_pipeline_template_by_name(
    monkeypatch, template_api_service, mock_templates_dir
):
    monkeypatch.setattr(
        services.template_service,
        "PIPELINE_TEMPLATES_DIR",
        str(mock_templates_dir),
    )
    pipeline_template = await get_pipeline_template_by_name(
        "test-pipeline", template_api_service
    )
    assert pipeline_template.name == "test-pipeline"
    assert pipeline_template.description == "test"
    assert pipeline_template.type == "pipeline"
    assert pipeline_template.pipeline_step == "pipeline"


@pytest.mark.asyncio
async def test_get_pipeline_template_by_name_not_found(
    monkeypatch, template_api_service, mock_templates_dir
):
    monkeypatch.setattr(
        services.template_service,
        "PIPELINE_TEMPLATES_DIR",
        str(mock_templates_dir),
    )
    with pytest.raises(HTTPException):
        await get_pipeline_template_by_name(
            "this-pipeline-does-not-exist", template_api_service
        )
