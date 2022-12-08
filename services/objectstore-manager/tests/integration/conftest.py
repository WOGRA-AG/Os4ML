from collections.abc import Sequence
from unittest.mock import Mock

import pytest
from minio.datatypes import Object
from minio.error import S3Error
from pytest_mock import MockerFixture


@pytest.fixture
def object_names() -> list[str]:
    return ["object1", "obj/object2", "other-object"]


@pytest.fixture
def bucket_name() -> str:
    return "test-bucket"


@pytest.fixture
def usertoken() -> str:
    return "eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJpUWR1ZW1PVlpfUVNCTDg5YTVjWFZiYjgzbEY2dGR3LVZLMjlCTnZUaHl3In0.eyJleHAiOjE2NjU3NTQ0MDIsImlhdCI6MTY2NTc1NDEwMiwiYXV0aF90aW1lIjoxNjY1NzU0MTAyLCJqdGkiOiI0NjgzMGY1YS0xOThmLTRlNjYtOTljMy01YTJkNzE0OGJjNjAiLCJpc3MiOiJodHRwczovL2xvZ2luLm9zNG1sLndvZ3JhLmNvbS9yZWFsbXMvb3M0bWwiLCJhdWQiOiJhY2NvdW50Iiwic3ViIjoiNWQ0MTE3MGYtMWI3MS00YjZlLThiMjYtNjMxZjFhMzEwNDNlIiwidHlwIjoiQmVhcmVyIiwiYXpwIjoia3ViZWZsb3ctb2lkYy1hdXRoc2VydmljZSIsIm5vbmNlIjoiSER4VTJTZVpVek1pdTJ1cUVRa3dOb0lMWXhxMXRYSjZSTGRtdE04bmxSdyIsInNlc3Npb25fc3RhdGUiOiIwY2YyZTI2Yy00Yjk0LTQwMjAtYWQwZS04M2JiMDNhMzIzOTgiLCJhY3IiOiIxIiwiYWxsb3dlZC1vcmlnaW5zIjpbIioiXSwicmVhbG1fYWNjZXNzIjp7InJvbGVzIjpbIm9mZmxpbmVfYWNjZXNzIiwidW1hX2F1dGhvcml6YXRpb24iLCJkZWZhdWx0LXJvbGVzLW9zNG1sIl19LCJyZXNvdXJjZV9hY2Nlc3MiOnsiYWNjb3VudCI6eyJyb2xlcyI6WyJtYW5hZ2UtYWNjb3VudCIsIm1hbmFnZS1hY2NvdW50LWxpbmtzIiwidmlldy1wcm9maWxlIl19fSwic2NvcGUiOiJvcGVuaWQgcHJvZmlsZSBlbWFpbCIsInNpZCI6IjBjZjJlMjZjLTRiOTQtNDAyMC1hZDBlLTgzYmIwM2EzMjM5OCIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJuYW1lIjoiZXhhbXBsZSB1c2VyIiwicHJlZmVycmVkX3VzZXJuYW1lIjoidXNlckBleGFtcGxlLmNvbSIsImdpdmVuX25hbWUiOiJleGFtcGxlIiwiZmFtaWx5X25hbWUiOiJ1c2VyIiwiZW1haWwiOiJ1c2VyQGV4YW1wbGUuY29tIn0.G7VS76tQ_RpOdmn311rou-ERGoHVzjO0HBmd4ug0m6qukTWra4_LgCqvHrrdwTP4sOnZA5qkwXhA44xQ0g7wNptsg8SIEA6_QZTCCJmyji34_8eeRbk1EiUzOtvtue3Hp2vldXjMXixgwUGTh7G82qPRXUyinBVTIZgA8zgrNlECv15X_exxDu55j-58IBld_ZMW7HzNuwxPlZ3as9vKLJaEoM5UqTLV13d_nPlFu7b1K1j8tHqF5AVMMRMul3MFmlz2m21HGdzRzkgwqJktObjwE7Ztqt-l4PBQpQSQp3G6zRuLeHib3kpSQ_76Zqb5dh4KvChBJzZrLDXcgkSHSQ"


@pytest.fixture
def user_header(usertoken: str) -> dict[str, str]:
    return {"usertoken": usertoken}


@pytest.fixture
def minio_mock(mocker: MockerFixture) -> Mock:
    return mocker.Mock()


@pytest.fixture
def bucket_exists_minio_mock(minio_mock) -> Mock:
    minio_mock.bucket_exists.return_value = True
    return minio_mock


@pytest.fixture
def non_existing_bucket_mock(minio_mock) -> Mock:
    minio_mock.bucket_exists.return_value = False
    return minio_mock


@pytest.fixture
def existing_objects_mock(
    bucket_exists_minio_mock: Mock,
    bucket_name: str,
    object_names: Sequence[str],
) -> Mock:
    bucket_exists_minio_mock.list_objects.return_value = [
        Object(bucket_name=bucket_name, object_name=object_name)
        for object_name in object_names
    ]
    return bucket_exists_minio_mock


@pytest.fixture
def non_existing_object_mock(bucket_exists_minio_mock: Mock) -> Mock:
    bucket_exists_minio_mock.stat_object.side_effect = S3Error(
        "NoSuchKey", "test_msg", None, None, None, None
    )
    return bucket_exists_minio_mock
