import pytest

from src.build.objectstore_client.model.json_response import JsonResponse
from src.build.openapi_server.models.databag import Databag
from src.lib.json_io import decode_json_response, prepare_model_for_api


@pytest.mark.parametrize(
    "json_response, json_dict",
    [
        (
            JsonResponse(
                json_content="eyJpZCI6ICI4OWExYzA4MC04ZjI5LTQ3MzMtYjIwYy03Y2NmOTMyZDI1MjgiLCAibmFtZSI6ICJy\nYXcgZGF0YSBzbWFsbCIsICJzdGF0dXMiOiAibWVzc2FnZS5waXBlbGluZS5kb25lLmRhdGFiYWdf\nZG9uZSIsICJydW5faWQiOiAiODhjODgzZGQtNWQ1My00ZjI2LWE2MmYtNjk0ZGRkOTZmOGZhIiwg\nImNyZWF0aW9uX3RpbWUiOiAiMjAyMy0wOS0wOFQxMjo0Njo0M1oiLCAiZGF0YWJhZ190eXBlIjog\nImxvY2FsX2ZpbGUiLCAibnVtYmVyX3Jvd3MiOiA0MCwgIm51bWJlcl9jb2x1bW5zIjogMiwgImNv\nbHVtbnMiOiBbeyJuYW1lIjogInRpZl9maWxlIiwgInR5cGUiOiAiaW1hZ2UiLCAibnVtX2VudHJp\nZXMiOiA0MH0sIHsibmFtZSI6ICJsYWJlbCIsICJ0eXBlIjogImNhdGVnb3J5IiwgIm51bV9lbnRy\naWVzIjogNDB9XSwgImRhdGFzZXRfZmlsZV9uYW1lIjogInJhd19kYXRhX3NtYWxsLnppcCIsICJk\nYXRhc2V0X3VybCI6IG51bGx9\n"
            ),
            {
                "id": "89a1c080-8f29-4733-b20c-7ccf932d2528",
                "name": "raw data small",
                "status": "message.pipeline.done.databag_done",
                "run_id": "88c883dd-5d53-4f26-a62f-694ddd96f8fa",
                "creation_time": "2023-09-08T12:46:43Z",
                "databag_type": "local_file",
                "number_rows": 40,
                "number_columns": 2,
                "columns": [
                    {"name": "tif_file", "type": "image", "num_entries": 40},
                    {"name": "label", "type": "category", "num_entries": 40},
                ],
                "dataset_file_name": "raw_data_small.zip",
                "dataset_url": None,
            },
        )
    ],
)
def test_decode_json_response(json_response: JsonResponse, json_dict: str):
    decoded_json = decode_json_response(json_response)
    assert decoded_json == json_dict


@pytest.mark.parametrize(
    "data, s",
    [
        (
            Databag(id="test-uuid", name="test"),
            '{"id": "test-uuid", "name": "test", "status": null, "run_id": null, "creation_time": null, "completion_time": null, "databag_type": null, "number_rows": null, "number_columns": null, "columns": null, "dataset_file_name": null, "dataset_url": null}',
        )
    ],
)
def test_prepare_model_for_api(data, s: str):
    assert prepare_model_for_api(data).read() == s
