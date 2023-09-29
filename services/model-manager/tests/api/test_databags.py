from unittest.mock import Mock

from fastapi.testclient import TestClient

from src.build.openapi_server.models.databag import Databag
from src.exceptions.file_name_not_specified import (
    DatasetFileNameNotSpecifiedException,
)
from src.exceptions.file_not_found import (
    DataframeNotFoundException,
    DatasetNotFoundException,
)
from src.exceptions.id_update_not_allowed import (
    DatabagIdUpdateNotAllowedException,
)
from src.exceptions.resource_not_found import DatabagNotFoundException


def test_get_databags(
    client: TestClient, databag_service: Mock, route_prefix: str
):
    databag_service.get_databags.return_value = []
    resp = client.get(f"{route_prefix}/databags")
    assert resp.status_code == 200
    assert resp.json() == []


def test_create_databag(
    client: TestClient, databag_service: Mock, route_prefix: str
):
    databag_service.create_databag.return_value = Databag(
        id="1", name="titanic"
    )
    resp = client.post(f"{route_prefix}/databags", json={})
    assert resp.status_code == 200
    assert resp.json()["id"] == "1"
    assert resp.json()["name"] == "titanic"


def test_get_databag_by_id(
    client: TestClient, databag_service: Mock, route_prefix: str
):
    databag_service.get_databag_by_id.return_value = Databag(
        id="1", name="titanic"
    )
    resp = client.get(f"{route_prefix}/databags/1")
    assert resp.status_code == 200
    assert resp.json()["id"] == "1"
    assert resp.json()["name"] == "titanic"


def test_get_databag_by_id_not_found(
    client: TestClient, databag_service: Mock, route_prefix: str
):
    databag_service.get_databag_by_id.side_effect = DatabagNotFoundException(
        "1"
    )
    resp = client.get(f"{route_prefix}/databags/1")
    assert resp.status_code == 404


def test_update_databag_by_id(
    client: TestClient, databag_service: Mock, route_prefix: str
):
    databag_service.update_databag.return_value = Databag(id="2")
    resp = client.put(f"{route_prefix}/databags/1", json={})
    assert resp.status_code == 200


def test_update_databag_id_update(
    client: TestClient, databag_service: Mock, route_prefix: str
):
    databag_service.update_databag.side_effect = (
        DatabagIdUpdateNotAllowedException()
    )
    resp = client.put(f"{route_prefix}/databags/1", json={})
    assert resp.status_code == 400


def test_delete_databag_by_id(
    client: TestClient, databag_service: Mock, route_prefix: str
):
    databag_service.delete_databag_by_id.return_value = None
    resp = client.delete(f"{route_prefix}/databags/1")
    assert resp.status_code == 200


def test_start_pipeline_for_databag(
    client: TestClient, databag_service: Mock, route_prefix: str
):
    databag_service.start_databag_pipeline.side_effect = Databag(id="1")
    resp = client.post(f"{route_prefix}/databags/1/start-pipeline")
    assert resp.status_code == 200


def test_start_pipeline_no_databag(
    client: TestClient, databag_service: Mock, route_prefix: str
):
    databag_service.start_databag_pipeline.side_effect = (
        DatabagNotFoundException("1")
    )
    resp = client.post(f"{route_prefix}/databags/1/start-pipeline")
    assert resp.status_code == 404


def test_get_dataset_get_url(
    client: TestClient, databag_service: Mock, route_prefix: str
):
    databag_service.get_dataset_get_url.return_value = "url"
    resp = client.get(f"{route_prefix}/databags/1/dataset")
    assert resp.status_code == 200
    assert resp.json() == "url"


def test_get_dataset_get_url_no_databag(
    client: TestClient, databag_service: Mock, route_prefix: str
):
    databag_service.get_dataset_get_url.side_effect = DatabagNotFoundException(
        "1"
    )
    resp = client.get(f"{route_prefix}/databags/1/dataset")
    assert resp.status_code == 404


def test_get_dataset_get_url_no_dataset_file_name(
    client: TestClient, databag_service: Mock, route_prefix: str
):
    databag_service.get_dataset_get_url.side_effect = (
        DatasetFileNameNotSpecifiedException()
    )
    resp = client.get(f"{route_prefix}/databags/1/dataset")
    assert resp.status_code == 400


def test_get_dataset_get_url_no_dataset(
    client: TestClient, databag_service: Mock, route_prefix: str
):
    databag_service.get_dataset_get_url.side_effect = (
        DatasetNotFoundException()
    )
    resp = client.get(f"{route_prefix}/databags/1/dataset")
    assert resp.status_code == 404


def test_create_dataset_put_url(
    client: TestClient, databag_service: Mock, route_prefix: str
):
    databag_service.create_dataset_put_url.return_value = "url"
    resp = client.post(f"{route_prefix}/databags/1/dataset")
    assert resp.status_code == 200
    assert resp.json() == "url"


def test_create_dataset_put_url_no_dataset_file_name(
    client: TestClient, databag_service: Mock, route_prefix: str
):
    databag_service.create_dataset_put_url.side_effect = (
        DatasetFileNameNotSpecifiedException()
    )
    resp = client.post(f"{route_prefix}/databags/1/dataset")
    assert resp.status_code == 400


def test_get_dataframe_get_url(
    client: TestClient, databag_service: Mock, route_prefix: str
):
    databag_service.get_dataframe_get_url.return_value = "url"
    resp = client.get(f"{route_prefix}/databags/1/dataframe")
    assert resp.status_code == 200
    assert resp.json() == "url"


def test_get_dataframe_get_url_not_dataframe(
    client: TestClient, databag_service: Mock, route_prefix: str
):
    databag_service.get_dataframe_get_url.side_effect = (
        DataframeNotFoundException()
    )
    resp = client.get(f"{route_prefix}/databags/1/dataframe")
    assert resp.status_code == 404


def test_create_dataframe_put_url(
    client: TestClient, databag_service: Mock, route_prefix: str
):
    databag_service.create_dataframe_put_url.return_value = "url"
    resp = client.post(f"{route_prefix}/databags/1/dataframe")
    assert resp.status_code == 200
