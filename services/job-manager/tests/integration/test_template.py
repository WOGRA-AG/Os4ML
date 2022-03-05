from unittest.mock import patch

import pytest
from openapi_client.model.pipeline_template import PipelineTemplate

from src.api.routers.template_router import post_template
from src.services.template_service import TemplateService
from tests.mocks.kfp_mock_client import KfpMockClient

mock_client = KfpMockClient()
mock_service = TemplateService(kfp_client=mock_client)


@pytest.mark.asyncio
@patch("openapi_client.api.objectstore_api.ObjectstoreApi.get_pipeline_template_by_name")
async def test_post_template(mock):
    mock.return_value = PipelineTemplate(name="test-pipeline", file_url="https://wogra.com")
    run_id: str = await post_template("test-pipeline", {}, mock_service)
    assert type(run_id) == str
