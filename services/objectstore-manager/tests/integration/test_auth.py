from pytest_mock import MockerFixture

from build.openapi_server.models.bucket import Bucket
from tests.conftest import user_header


def test_list_buckets_with_user(client, mocker: MockerFixture):
    mocker.patch("minio.Minio.__init__", return_value=None)
    mocker.patch(
        "minio.Minio.list_buckets", return_value=[Bucket(name="test")]
    )
    response = client.get(
        "/apis/v1beta1/objectstore",
        headers=user_header,
    )
    assert response.status_code == 200


def test_list_buckets_unauthorized(client):
    response = client.get(
        "/apis/v1beta1/objectstore",
        headers={"usertoken": "no valid jwt token"},
    )
    assert response.status_code == 401
    assert "Invalid Authorization Header" in response.json()["detail"]
