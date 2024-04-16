from unittest.mock import Mock

from fastapi.testclient import TestClient

from src.build.openapi_server.models.transfer_learning_model import (
    TransferLearningModel,
)
from src.exceptions import TransferLearningModelNotFoundException


def test_get_transfer_learning_models(
    client: TestClient, transfer_learning_service: Mock, route_prefix: str
):
    transfer_learning_service.get_transfer_learning_models.return_value = []
    response = client.get(f"{route_prefix}/transfer-learning-models")
    assert response.status_code == 200
    assert response.json() == []


def test_create_new_transfer_learning_model_from_solution(
    client: TestClient, transfer_learning_service: Mock, route_prefix: str
):
    transfer_learning_service.create_new_transfer_learning_model_from_solution.return_value = TransferLearningModel(
        id="1", name="bert", type="solution"
    )
    response = client.post(f"{route_prefix}/transfer-learning-models")
    assert response.status_code == 200


def test_get_transfer_learning_model_by_id(
    client: TestClient, transfer_learning_service: Mock, route_prefix: str
):
    transfer_learning_service.get_transfer_learning_model_by_id.return_value = TransferLearningModel(
        id="1", name="bert", type="solution", value="1"
    )
    response = client.get(f"{route_prefix}/transfer-learning-models/1")
    assert response.status_code == 200


def test_get_transfer_learning_model_by_id_not_found(
    client: TestClient, transfer_learning_service: Mock, route_prefix: str
):
    transfer_learning_service.get_transfer_learning_model_by_id.side_effect = (
        TransferLearningModelNotFoundException("1")
    )
    response = client.get(f"{route_prefix}/transfer-learning-models/1")
    assert response.status_code == 404


def test_update_transfer_learning_model_by_id(
    client: TestClient, transfer_learning_service: Mock, route_prefix: str
):
    transfer_learning_service.update_transfer_learning_model_by_id.return_value = TransferLearningModel(
        id="1", name="bert", type="solution", value="1"
    )
    response = client.put(f"{route_prefix}/transfer-learning-models/1")
    assert response.status_code == 200


def test_delete_transfer_learning_model_by_id(
    client: TestClient, transfer_learning_service: Mock, route_prefix: str
):
    transfer_learning_service.delete_transfer_learning_model_by_id.return_value = (
        None
    )
    response = client.delete(f"{route_prefix}/transfer-learning-models/1")
    assert response.status_code == 200


def test_share_transfer_learning_model(
    client: TestClient, transfer_learning_service: Mock, route_prefix: str
):
    transfer_learning_service.share_transfer_learning_model.return_value = (
        TransferLearningModel(
            id="1", name="bert", type="solution", value="1", shared_with=["1"]
        )
    )
    response = client.post(
        f"{route_prefix}/transfer-learning-models/1/share",
        json={"user_id": "1"},
    )
    assert response.status_code == 200
