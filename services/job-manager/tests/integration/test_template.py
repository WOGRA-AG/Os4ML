import pytest
from mocks.kfp_mock_client import KfpMockClient

from api.template_api_service import TemplateApiService
from build.openapi_server.apis.template_api import post_template
from build.openapi_server.models.run_params import RunParams
from services.template_service import TemplateService

mock_kfp_client = KfpMockClient()
mock_template_service = TemplateService(kfp_client=mock_kfp_client)
mock_api_service = TemplateApiService(template_service=mock_template_service)


@pytest.mark.asyncio
async def test_post_template(mocker):
    mocker.patch.object(
        mock_template_service,
        "get_pipeline_file_path",
        return_value="/tmp/pipeline.yaml",
    )
    run_id: str = await post_template(
        "test-pipeline", RunParams(), _service=mock_api_service
    )
    assert type(run_id) == str
