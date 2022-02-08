# coding: utf-8

from fastapi.testclient import TestClient


def test_get_all_pipelines(client: TestClient):
    """Test case for get_all_pipelines

    Get all pipelines
    """

    headers = {}
    response = client.request(
        "GET", "/apis/v1beta1/jobmanager/experiment/{ExperimentId}/pipeline".format(ExperimentId=56), headers=headers,
    )

    # uncomment below to assert the status code of the HTTP response
    # assert response.status_code == 200


def test_post_pipeline(client: TestClient):
    """Test case for post_pipeline

    Create Pipeline
    """

    headers = {}
    response = client.request(
        "POST",
        "/apis/v1beta1/jobmanager/experiment/{ExperimentId}/pipeline/{PipelineId}".format(
            ExperimentId=56, PipelineId=56
        ),
        headers=headers,
    )

    # uncomment below to assert the status code of the HTTP response
    # assert response.status_code == 200
