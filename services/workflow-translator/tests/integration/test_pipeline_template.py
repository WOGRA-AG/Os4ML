from pathlib import PosixPath

from conftest import user_header
from pytest_mock import MockerFixture


def test_get_pipeline_template_by_name(
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
    open_patch.assert_called()
    assert "apiVersion" in response.json()


def test_template_by_name_not_found(client, mocker: MockerFixture):
    open_patch = mocker.patch("builtins.open", mocker.mock_open())
    open_patch.side_effect = [FileNotFoundError, None]
    response = client.get(
        "/apis/v1beta1/workflowtranslator/template/pipeline/databag",
        headers=user_header,
    )
    assert response.status_code == 404
    assert "/pipelines/databag/pipeline.yaml" in response.json()["message"]


def test_template_by_name_forbidden(client, mocker: MockerFixture):
    open_patch = mocker.patch("builtins.open", mocker.mock_open())
    open_patch.side_effect = [PermissionError, None]
    response = client.get(
        "/apis/v1beta1/workflowtranslator/template/pipeline/databag",
        headers=user_header,
    )
    assert response.status_code == 403
    assert "/pipelines/databag/pipeline.yaml" in response.json()["message"]


def test_template_by_name_malformed(client, mocker: MockerFixture):
    open_patch = mocker.patch(
        "builtins.open", mocker.mock_open(read_data="{))]")
    )
    response = client.get(
        "/apis/v1beta1/workflowtranslator/template/pipeline/databag",
        headers=user_header,
    )
    assert response.status_code == 400
    open_patch.assert_called_with(
        PosixPath("/pipelines/databag/pipeline.yaml"), "r"
    )
    assert "Error while parsing" in response.json()["message"]
