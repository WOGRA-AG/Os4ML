# coding: utf-8

from fastapi.testclient import TestClient


def test_get_all_artifacts(client: TestClient):
    """Test case for get_all_artifacts

    Get all pipeline artifacts
    """

    headers = {}
    response = client.request(
        "GET",
        "/apis/v1beta1/jobmanager/experiment/{ExperimentId}/pipeline/{PipelineId}/artifacts".format(
            ExperimentId=56, PipelineId=56
        ),
        headers=headers,
    )

    # uncomment below to assert the status code of the HTTP response
    # assert response.status_code == 200
