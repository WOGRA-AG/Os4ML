from unittest.mock import Mock

import pytest
from fastapi.testclient import TestClient
from pytest_mock import MockerFixture

import src.build.openapi_server.apis.modelmanager_api
from src.build.openapi_server.models.prediction import Prediction
from src.exceptions import (
    ModelIdUpdateNotAllowedException,
    ModelNotFoundException,
)


@pytest.fixture
def prediction_service(mocker: MockerFixture) -> Mock:
    service = mocker.Mock()

    def mock_init(self, **kwargs):
        for key, value in kwargs.items():
            setattr(self, key, value)
        setattr(self, "prediction_service", service)

    mocker.patch.object(
        src.build.openapi_server.apis.modelmanager_api.ModelmanagerApiController,
        "__init__",
        mock_init,
    )
    return service


@pytest.fixture
def prediction():
    return Prediction(id="prediction_id", name="prediction")


@pytest.mark.asyncio
async def test_get_predictions(
    client: TestClient,
    route_prefix: str,
    prediction_service: Mock,
    prediction: Prediction,
):
    prediction_service.get_predictions.return_value = [
        prediction,
        prediction,
    ]
    resp = client.get(route_prefix + "predictions")
    assert resp.status_code == 200
    assert len(resp.json()) == 2
    assert resp.json()[0]["id"] == "prediction_id"


@pytest.mark.asyncio
async def test_get_prediction_by_id(
    client: TestClient,
    route_prefix: str,
    prediction_service: Mock,
    prediction: Prediction,
):
    prediction_service.get_prediction_by_id.return_value = prediction
    resp = client.get(route_prefix + "predictions/prediction_id")
    assert resp.status_code == 200
    assert resp.json()["id"] == "prediction_id"


@pytest.mark.asyncio
async def test_get_prediction_by_id_not_found(
    client: TestClient,
    route_prefix: str,
    prediction_service: Mock,
):
    prediction_service.get_prediction_by_id.side_effect = (
        ModelNotFoundException("", "")
    )
    resp = client.get(route_prefix + "predictions/prediction_id")
    assert resp.status_code == 404


@pytest.mark.asyncio
async def test_update_prediction_by_id(
    client: TestClient,
    route_prefix: str,
    prediction_service: Mock,
    prediction: Prediction,
):
    prediction_service.update_prediction_by_id.return_value = prediction
    resp = client.put(
        route_prefix + "predictions/prediction_id",
        json=prediction.dict(),
    )
    assert resp.status_code == 200
    assert resp.json()["id"] == "prediction_id"
    assert resp.json()["name"] == "prediction"


@pytest.mark.asyncio
async def test_update_prediction_by_id_id_update(
    client: TestClient,
    route_prefix: str,
    prediction_service: Mock,
    prediction: Prediction,
):
    prediction_service.update_prediction_by_id.side_effect = (
        ModelIdUpdateNotAllowedException("")
    )
    resp = client.put(
        route_prefix + "predictions/other_prediction_id",
        json=prediction.dict(),
    )
    assert resp.status_code == 400


@pytest.mark.asyncio
@pytest.mark.xfail
async def test_create_prediction(
    client: TestClient,
    route_prefix: str,
    prediction_service: Mock,
    prediction: Prediction,
):
    prediction_service.create_prediction.return_value = prediction
    resp = client.post(route_prefix + "predictions", json=prediction.dict())
    assert resp.status_code == 201
    assert resp.json()["id"] == "prediction_id"


@pytest.mark.asyncio
async def test_create_prediction_assert_200(
    client: TestClient,
    route_prefix: str,
    prediction_service: Mock,
    prediction: Prediction,
):
    prediction_service.create_prediction.return_value = prediction
    resp = client.post(route_prefix + "predictions", json=prediction.dict())
    assert resp.status_code == 200
    assert resp.json()["id"] == "prediction_id"


@pytest.mark.asyncio
@pytest.mark.xfail
async def test_delete_prediction_by_id(
    client: TestClient,
    route_prefix: str,
    prediction_service: Mock,
):
    prediction_service.delete_prediction_by_id.return_value = None
    resp = client.delete(route_prefix + "predictions/prediction_id")
    assert resp.status_code == 204


@pytest.mark.asyncio
async def test_delete_prediction_by_id_assert_200(
    client: TestClient,
    route_prefix: str,
    prediction_service: Mock,
):
    prediction_service.delete_prediction_by_id.return_value = None
    resp = client.delete(route_prefix + "predictions/prediction_id")
    assert resp.status_code == 200


@pytest.mark.asyncio
async def test_get_prediction_data_put_url(
    client: TestClient, route_prefix: str, prediction_service: Mock
):
    prediction_service.get_prediction_data_put_url.return_value = (
        "http://minio.wogra.com/put/data/here.csv",
    )
    resp = client.get(
        route_prefix + "solutions/solution_id/prediction-data/file.csv"
    )
    assert resp.status_code == 200
    assert resp.json()["predictionId"] == "prediction_id"
    assert resp.json()["url"].startswith("http")


@pytest.mark.asyncio
async def test_get_prediction_result_put_url(
    client: TestClient, route_prefix: str, prediction_service: Mock
):
    prediction_service.get_prediction_result_put_url.return_value = (
        "http://minio.wogra.com/put/result/here.csv"
    )
    resp = client.get(
        route_prefix + "predictions/prediction_id/prediction-result"
    )
    assert resp.status_code == 200
    assert resp.json().startswith("http")
