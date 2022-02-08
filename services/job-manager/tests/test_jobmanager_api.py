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


def test_get_all_experiments(client: TestClient):
    """Test case for get_all_experiments

    Get all Experiments
    """

    headers = {}
    response = client.request("GET", "/apis/v1beta1/jobmanager/experiment", headers=headers,)

    # uncomment below to assert the status code of the HTTP response
    # assert response.status_code == 200


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


def test_get_all_runs(client: TestClient):
    """Test case for get_all_runs

    Get all pipeline runs
    """

    headers = {}
    response = client.request(
        "GET",
        "/apis/v1beta1/jobmanager/experiment/{ExperimentId}/pipeline/{PipelineId}/run".format(
            ExperimentId=56, PipelineId=56
        ),
        headers=headers,
    )

    # uncomment below to assert the status code of the HTTP response
    # assert response.status_code == 200


def test_post_experiment(client: TestClient):
    """Test case for post_experiment

    Create new Experiment
    """

    headers = {}
    response = client.request(
        "POST", "/apis/v1beta1/jobmanager/experiment/{ExperimentId}".format(ExperimentId=56), headers=headers,
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


def test_post_run(client: TestClient):
    """Test case for post_run

    Create Run
    """

    headers = {}
    response = client.request(
        "POST",
        "/apis/v1beta1/jobmanager/experiment/{ExperimentId}/pipeline/{PipelineId}/run".format(
            ExperimentId=56, PipelineId=56
        ),
        headers=headers,
    )

    # uncomment below to assert the status code of the HTTP response
    # assert response.status_code == 200
