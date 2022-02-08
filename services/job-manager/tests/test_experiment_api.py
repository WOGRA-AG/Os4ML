# coding: utf-8

from fastapi.testclient import TestClient


def test_get_all_experiments(client: TestClient):
    """Test case for get_all_experiments

    Get all Experiments
    """

    headers = {}
    response = client.request("GET", "/apis/v1beta1/jobmanager/experiment", headers=headers,)

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
