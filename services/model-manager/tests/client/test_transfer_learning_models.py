from unittest.mock import Mock

from fastapi.testclient import TestClient

from src.build.openapi_server.models.transfer_learning_model import (
    TransferLearningModel,
)


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


def test_delete_transfer_learning_model_by_id(
    client: TestClient, transfer_learning_service: Mock, route_prefix: str
):
    transfer_learning_service.delete_transfer_learning_model_by_id.return_value = (
        None
    )
    response = client.delete(f"{route_prefix}/transfer-learning-models/1")
    assert response.status_code == 200
