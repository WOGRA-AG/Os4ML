import pytest
from fastapi.testclient import TestClient
from mocks.kfp_mock_client import KfpMockClient
from build.openapi_client.model.pipeline_template import PipelineTemplate

from api.template_api_service import TemplateApiService
from build.openapi_server.apis.template_api import post_template
from services.template_service import TemplateService

mock_kfp_client = KfpMockClient()
mock_template_service = TemplateService(kfp_client=mock_kfp_client)
mock_api_service = TemplateApiService(template_service=mock_template_service)


@pytest.mark.asyncio
async def test_post_template(mocker):
    mocker.patch(
        "build.openapi_client.api.objectstore_api.ObjectstoreApi.get_pipeline_template_by_name",
        return_value=PipelineTemplate(
            name="test-pipeline", file_url="https://wogra.com"
        ),
    )
    run_id: str = await post_template(
        "test-pipeline", {}, _service=mock_api_service
    )
    assert type(run_id) == str
