from fastapi.testclient import TestClient
from pytest_mock import MockerFixture


def test_get_presigned_get_url_with_user(
    client: TestClient,
    mocker: MockerFixture,
    user_header: dict[str, str],
    route_prefix: str,
):
    mocker.patch("minio.Minio.bucket_exists", return_value=True)
    mocker.patch("minio.Minio.stat_object")
    mocker.patch("minio.Minio.presigned_get_object")
    response = client.get(
        route_prefix + "objects/presignedgeturl",
        headers=user_header,
    )
    assert response.status_code == 200


def test_get_presigned_get_url_unauthorized(
    client: TestClient, route_prefix: str
):
    response = client.get(
        route_prefix + "objects/presignedgeturl",
        headers={"usertoken": "no valid jwt token"},
    )
    assert response.status_code == 401
    assert "Invalid Authorization Header" in response.json()["detail"]
