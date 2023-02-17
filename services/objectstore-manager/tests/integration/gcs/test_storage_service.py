import io
import json

import pytest
import requests
from google.cloud.storage import Client

from exceptions import BucketNotFoundException, ObjectNotFoundException
from repository import GcsRepository, StorageRepository
from services.storage_service import StorageService


def test_gcs_is_used(storage_service: StorageService):
    assert type(storage_service.storage) == GcsRepository
    assert storage_service.bucket_name == "os4ml-test"


def test_create_object_by_name(
    create_object: str, client: Client, bucket_name: str
):
    (blob,) = client.list_blobs(bucket_name)
    assert blob.name == create_object


def test_list_objects(create_object: str, storage_service: StorageService):
    (name,) = storage_service.list_objects("test")
    assert name == create_object


def test_list_objects_with_non_matching_prefix(
    create_object: str, storage_service: StorageService
):
    assert len(storage_service.list_objects("not-a-prefix")) == 0


def test_list_objects_with_no_objects(storage_service: StorageService):
    assert len(storage_service.list_objects("")) == 0


def test_delete_objects_non_existing_object(storage_service: StorageService):
    storage_service.delete_objects("this_object_does_not_exist")


def test_delete_objects_matching_object(
    create_object: str, storage_service: StorageService
):
    storage_service.delete_objects(create_object)
    assert len(storage_service.list_objects("")) == 0


def test_delete_objects_non_matching_object(
    create_object: str, storage_service: StorageService
):
    storage_service.delete_objects("not_a_prefix")
    assert len(storage_service.list_objects("")) == 1


def test_get_json_object_by_name(create_json_object: str, storage_service):
    json_str = storage_service.get_json_object_by_name(create_json_object)
    json_dict = json.loads(json_str)
    assert json_dict["text"] == "This is valid json."


def test_get_json_object_by_name_non_existing_object(
    storage_service: StorageService,
):
    with pytest.raises(ObjectNotFoundException):
        storage_service.get_json_object_by_name("does_not_exist")


def test_get_json_object_by_name_non_existing_bucket(
    storage_repository: StorageRepository,
):
    service = StorageService(storage_repository, "os4ml-wrong-bucket")
    with pytest.raises(BucketNotFoundException):
        service.get_json_object_by_name("wrong_bucket")


def test_get_presigned_get_url(
    create_object: str, storage_service: StorageService
):
    url = storage_service.get_presigned_get_url(create_object)
    resp = requests.get(url)
    assert resp.status_code == 200
    assert resp.text == "This is a test."


def test_get_presinge_get_url_for_non_existing_file(
    storage_service: StorageService,
):
    with pytest.raises(ObjectNotFoundException):
        storage_service.get_presigned_get_url("does_not_exist")


def test_get_presigned_put_url(storage_service: StorageService):
    assert len(storage_service.list_objects("")) == 0
    url = storage_service.get_presigned_put_url("uploaded_object")
    file = io.BytesIO()
    file.write(b"Uploaded with put url.")
    file.seek(0)
    headers = {"content-type": "application/octet-stream"}
    requests.put(url, data=file, headers=headers)
    assert len(storage_service.list_objects("")) == 1
