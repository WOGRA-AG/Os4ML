from pathlib import PosixPath

from conftest import user_header
from pytest_mock import MockerFixture


def test_get_pipeline_template_by_name_with_user(
    client, pipeline_template: str, mocker: MockerFixture
):
    open_patch = mocker.patch(
        "builtins.open", mocker.mock_open(read_data=pipeline_template)
    )
    response = client.get(
        "/apis/v1beta1/workflowtranslator/template/pipeline/databag",
        headers=user_header,
    )
    assert response.status_code == 200
    open_patch.assert_called_with(
        PosixPath("/pipelines/databag/pipeline.yaml"), "r"
    )
    assert "apiVersion" in response.json()


def test_get_pipeline_template_by_name_unauthorized(
    client,
):
    response = client.get(
        "/apis/v1beta1/workflowtranslator/template/pipeline/databag",
        headers={"usertoken": "no valid jwt token"},
    )
    assert response.status_code == 401
    assert "Invalid Authorization Header" in response.json()["detail"]
