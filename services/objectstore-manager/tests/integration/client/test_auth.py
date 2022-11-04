from fastapi.testclient import TestClient


def test_get_presigned_get_url_with_user(
    client: TestClient,
    existing_objects_repository,
    user_header: dict[str, str],
    route_prefix: str,
):
    existing_objects_repository.stat_object.return_value = True
    existing_objects_repository.presigned_get_object.return_value = "url"
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
