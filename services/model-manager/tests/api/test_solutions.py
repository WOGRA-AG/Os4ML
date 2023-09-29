from unittest.mock import Mock

from fastapi.testclient import TestClient

from src.build.openapi_server.models.solution import Solution
from src.exceptions.file_name_not_specified import (
    PredictionTemplateFileNameNotSpecifiedException,
)
from src.exceptions.file_not_found import (
    ModelFileNotFoundException,
    PredictionTemplateNotFoundException,
)
from src.exceptions.id_update_not_allowed import (
    SolutionIdUpdateNotAllowedException,
)
from src.exceptions.resource_not_found import SolutionNotFoundException


def test_get_solutions(
    client: TestClient, solution_service: Mock, route_prefix: str
):
    solution_service.get_solutions.return_value = []
    response = client.get(f"{route_prefix}/solutions")
    assert response.status_code == 200


def test_create_solution(
    client: TestClient, solution_service: Mock, route_prefix: str
):
    solution_service.create_solution.return_value = Solution(id="1")
    response = client.post(f"{route_prefix}/solutions")
    assert response.status_code == 200
    assert response.json()["id"] == "1"


def test_get_solution_by_id(
    client: TestClient, solution_service: Mock, route_prefix: str
):
    solution_service.get_solution_by_id.return_value = Solution(id="1")
    response = client.get(f"{route_prefix}/solutions/1")
    assert response.status_code == 200


def test_get_solution_by_id_not_found(
    client: TestClient, solution_service: Mock, route_prefix: str
):
    solution_service.get_solution_by_id.side_effect = (
        SolutionNotFoundException("1")
    )
    response = client.get(f"{route_prefix}/solutions/1")
    assert response.status_code == 404


def test_update_solution_by_id(
    client: TestClient, solution_service: Mock, route_prefix: str
):
    solution_service.update_solution_by_id.return_value = Solution(id="1")
    response = client.put(f"{route_prefix}/solutions/1")
    assert response.status_code == 200


def test_update_solution_by_id_no_id_update(
    client: TestClient, solution_service: Mock, route_prefix: str
):
    solution_service.update_solution_by_id.side_effect = (
        SolutionIdUpdateNotAllowedException()
    )
    response = client.put(f"{route_prefix}/solutions/1")
    assert response.status_code == 400


def test_delete_solution_by_id(
    client: TestClient, solution_service: Mock, route_prefix: str
):
    solution_service.delete_solution_by_id.return_value = None
    response = client.delete(f"{route_prefix}/solutions/1")
    assert response.status_code == 200


def test_start_solution_pipeline(
    client: TestClient, solution_service: Mock, route_prefix: str
):
    solution_service.start_solution_pipeline.return_value = Solution(id="1")
    response = client.post(f"{route_prefix}/solutions/1/start-pipeline")
    assert response.status_code == 200


def test_start_solution_pipeline_not_found(
    client: TestClient, solution_service: Mock, route_prefix: str
):
    solution_service.start_solution_pipeline.side_effect = (
        SolutionNotFoundException("1")
    )
    response = client.post(f"{route_prefix}/solutions/1/start-pipeline")
    assert response.status_code == 404


def test_get_model_get_url(
    client: TestClient, solution_service: Mock, route_prefix: str
):
    solution_service.get_model_get_url.return_value = "url"
    response = client.get(f"{route_prefix}/solutions/1/model")
    assert response.status_code == 200
    assert response.json() == "url"


def test_get_model_get_url_no_model(
    client: TestClient, solution_service: Mock, route_prefix: str
):
    solution_service.get_model_get_url.side_effect = (
        ModelFileNotFoundException()
    )
    response = client.get(f"{route_prefix}/solutions/1/model")
    assert response.status_code == 404


def test_create_model_put_url(
    client: TestClient, solution_service: Mock, route_prefix: str
):
    solution_service.create_model_put_url.return_value = "url"
    response = client.post(f"{route_prefix}/solutions/1/model")
    assert response.status_code == 200
    assert response.json() == "url"


def test_get_prediction_template_get_url(
    client: TestClient, solution_service: Mock, route_prefix: str
):
    solution_service.get_prediction_template_get_url.return_value = "url"
    response = client.get(f"{route_prefix}/solutions/1/prediction-template")
    assert response.status_code == 200
    assert response.json() == "url"


def test_get_precition_template_get_url_no_solution(
    client: TestClient, solution_service: Mock, route_prefix: str
):
    solution_service.get_prediction_template_get_url.side_effect = (
        SolutionNotFoundException("1")
    )
    response = client.get(f"{route_prefix}/solutions/1/prediction-template")
    assert response.status_code == 404


def test_get_prediction_template_get_url_no_template_file_name(
    client: TestClient, solution_service: Mock, route_prefix: str
):
    solution_service.get_prediction_template_get_url.side_effect = (
        PredictionTemplateFileNameNotSpecifiedException()
    )
    response = client.get(f"{route_prefix}/solutions/1/prediction-template")
    assert response.status_code == 400


def test_get_precition_template_get_url_no_prediction_template(
    client: TestClient, solution_service: Mock, route_prefix: str
):
    solution_service.get_prediction_template_get_url.side_effect = (
        PredictionTemplateNotFoundException()
    )
    response = client.get(f"{route_prefix}/solutions/1/prediction-template")
    assert response.status_code == 404


def test_create_prediction_template_put_url(
    client: TestClient, solution_service: Mock, route_prefix: str
):
    solution_service.create_prediction_template_put_url.return_value = "url"
    response = client.post(f"{route_prefix}/solutions/1/prediction-template")
    assert response.status_code == 200
    assert response.json() == "url"


def test_create_prediction_template_put_url_no_solution(
    client: TestClient, solution_service: Mock, route_prefix: str
):
    solution_service.create_prediction_template_put_url.side_effect = (
        SolutionNotFoundException("1")
    )
    response = client.post(f"{route_prefix}/solutions/1/prediction-template")
    assert response.status_code == 404


def test_create_prediction_template_put_url_no_template_file_name(
    client: TestClient, solution_service: Mock, route_prefix: str
):
    solution_service.create_prediction_template_put_url.side_effect = (
        PredictionTemplateFileNameNotSpecifiedException()
    )
    response = client.post(f"{route_prefix}/solutions/1/prediction-template")
    assert response.status_code == 400
