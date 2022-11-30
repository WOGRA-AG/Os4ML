from unittest.mock import Mock

import pytest
from fastapi.testclient import TestClient
from pytest_mock import MockerFixture

import repository.init_repository
from repository import MinioRepository


@pytest.mark.xfail  # see issue #287
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
