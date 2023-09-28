from unittest.mock import Mock

from fastapi.testclient import TestClient

from src.build.openapi_server.models.prediction import Prediction
from src.exceptions.file_name_not_specified import (
    PredictionDataFileNameNotSpecifiedException,
)
from src.exceptions.file_not_found import (
    PredictionDataNotFoundException,
    PredictionResultNotFoundException,
)
from src.exceptions.id_update_not_allowed import (
    PredictionIdUpdateNotAllowedExeption,
)
from src.exceptions.resource_not_found import PredictionNotFoundException


def test_get_predictions(
    client: TestClient, prediction_service: Mock, route_prefix: str
):
    prediction_service.get_predictions.return_value = []
    resp = client.get(f"{route_prefix}/predictions")
    assert resp.status_code == 200
    assert resp.json() == []


def test_create_prediction(
    client: TestClient, prediction_service: Mock, route_prefix: str
):
    prediction_service.create_prediction.return_value = Prediction(id="1")
    resp = client.post(f"{route_prefix}/predictions", json={})
    assert resp.status_code == 200


def test_get_prediction_by_id(
    client: TestClient, prediction_service: Mock, route_prefix: str
):
    prediction_service.get_prediction_by_id.return_value = Prediction(id="1")
    resp = client.get(f"{route_prefix}/predictions/1")
    assert resp.status_code == 200


def test_get_prediction_by_id_not_found(
    client: TestClient, prediction_service: Mock, route_prefix: str
):
    prediction_service.get_prediction_by_id.side_effect = (
        PredictionNotFoundException("1")
    )
    resp = client.get(f"{route_prefix}/predictions/1")
    assert resp.status_code == 404


def test_update_prediction_by_id(
    client: TestClient, prediction_service: Mock, route_prefix: str
):
    prediction_service.update_prediction_by_id.return_value = Prediction(
        id="1"
    )
    resp = client.put(f"{route_prefix}/predictions/1", json={})
    assert resp.status_code == 200


def test_update_prediction_by_id_no_id_update(
    client: TestClient, prediction_service: Mock, route_prefix: str
):
    prediction_service.update_prediction_by_id.side_effect = (
        PredictionIdUpdateNotAllowedExeption()
    )
    resp = client.put(f"{route_prefix}/predictions/1", json={})
    assert resp.status_code == 400


def test_delete_prediction_by_id(
    client: TestClient, prediction_service: Mock, route_prefix: str
):
    prediction_service.delete_prediction_by_id.return_value = None
    resp = client.delete(f"{route_prefix}/predictions/1")
    assert resp.status_code == 200


def test_start_prediction_pipeline(
    client: TestClient, prediction_service: Mock, route_prefix: str
):
    prediction_service.start_prediction_pipeline.return_value = Prediction(
        id="1"
    )
    resp = client.post(f"{route_prefix}/predictions/1/start-pipeline")
    assert resp.status_code == 200


def test_start_prediction_pipeline_no_prediction(
    client: TestClient, prediction_service: Mock, route_prefix: str
):
    prediction_service.start_prediction_pipeline.side_effect = (
        PredictionNotFoundException("1")
    )
    resp = client.post(f"{route_prefix}/predictions/1/start-pipeline")
    assert resp.status_code == 404


def test_get_prediction_data_get_url(
    client: TestClient, prediction_service: Mock, route_prefix: str
):
    prediction_service.get_prediction_data_get_url.return_value = "url"
    resp = client.get(f"{route_prefix}/predictions/1/prediction-data")
    assert resp.status_code == 200
    assert resp.json() == "url"


def test_get_prediction_data_get_url_no_prediction(
    client: TestClient, prediction_service: Mock, route_prefix: str
):
    prediction_service.get_prediction_data_get_url.side_effect = (
        PredictionNotFoundException("1")
    )
    resp = client.get(f"{route_prefix}/predictions/1/prediction-data")
    assert resp.status_code == 404


def test_get_prediction_data_get_url_no_prediction_data_file_name(
    client: TestClient, prediction_service: Mock, route_prefix: str
):
    prediction_service.get_prediction_data_get_url.side_effect = (
        PredictionDataFileNameNotSpecifiedException()
    )
    resp = client.get(f"{route_prefix}/predictions/1/prediction-data")
    assert resp.status_code == 400


def test_get_prediction_data_get_url_no_prediction_data(
    client: TestClient, prediction_service: Mock, route_prefix: str
):
    prediction_service.get_prediction_data_get_url.side_effect = (
        PredictionDataNotFoundException()
    )
    resp = client.get(f"{route_prefix}/predictions/1/prediction-data")
    assert resp.status_code == 404


def test_create_prediction_data_put_url(
    client: TestClient, prediction_service: Mock, route_prefix: str
):
    prediction_service.create_prediction_data_put_url.return_value = "url"
    resp = client.post(
        f"{route_prefix}/predictions/1/prediction-data", json={}
    )
    assert resp.status_code == 200
    assert resp.json() == "url"


def test_create_prediction_data_put_url_no_prediction(
    client: TestClient, prediction_service: Mock, route_prefix: str
):
    prediction_service.create_prediction_data_put_url.side_effect = (
        PredictionNotFoundException("1")
    )
    resp = client.post(
        f"{route_prefix}/predictions/1/prediction-data", json={}
    )
    assert resp.status_code == 404


def test_create_prediction_data_put_url_no_prediction_data_file_name(
    client: TestClient, prediction_service: Mock, route_prefix: str
):
    prediction_service.create_prediction_data_put_url.side_effect = (
        PredictionDataFileNameNotSpecifiedException()
    )
    resp = client.post(
        f"{route_prefix}/predictions/1/prediction-data", json={}
    )
    assert resp.status_code == 400


def test_get_prediction_result_get_url(
    client: TestClient, prediction_service: Mock, route_prefix: str
):
    prediction_service.get_prediction_result_get_url.return_value = "url"
    resp = client.get(f"{route_prefix}/predictions/1/prediction-result")
    assert resp.status_code == 200
    assert resp.json() == "url"


def test_get_prediction_result_get_url_no_prediction(
    client: TestClient, prediction_service: Mock, route_prefix: str
):
    prediction_service.get_prediction_result_get_url.side_effect = (
        PredictionNotFoundException("1")
    )
    resp = client.get(f"{route_prefix}/predictions/1/prediction-result")
    assert resp.status_code == 404


def test_get_prediction_result_get_url_no_prediction_result(
    client: TestClient, prediction_service: Mock, route_prefix: str
):
    prediction_service.get_prediction_result_get_url.side_effect = (
        PredictionResultNotFoundException()
    )
    resp = client.get(f"{route_prefix}/predictions/1/prediction-result")
    assert resp.status_code == 404


def test_create_prediction_result_put_url(
    client: TestClient, prediction_service: Mock, route_prefix: str
):
    prediction_service.create_prediction_result_put_url.return_value = "url"
    resp = client.post(
        f"{route_prefix}/predictions/1/prediction-result", json={}
    )
    assert resp.status_code == 200
    assert resp.json() == "url"
