from unittest.mock import Mock

import pytest as pytest
from fastapi.testclient import TestClient


@pytest.mark.xfail(raises=AssertionError, reason="issue #287")
def test_delete_object_by_name(
    existing_objects_mock: Mock,
    client: TestClient,
    route_prefix: str,
    user_header: dict[str, str],
):
    response = client.delete(
        route_prefix + "objects?objectName=object1", headers=user_header
    )
    assert response.status_code == 204


@pytest.mark.xfail(raises=AssertionError, reason="issue #287")
def test_delete_objects_with_prefix(
    existing_objects_mock: Mock,
    client: TestClient,
    route_prefix: str,
    user_header: dict[str, str],
):
    response = client.get(
        route_prefix + "objects/prefix",
        headers=user_header,
    )
    assert response.status_code == 204
