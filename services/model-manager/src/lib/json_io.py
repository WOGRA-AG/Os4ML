import base64
import json
from functools import singledispatch
from io import StringIO
from typing import Any, Protocol

from src.build.objectstore_client.model.json_response import JsonResponse


class Dictable(Protocol):
    def dict(self) -> dict[Any, Any]:
        ...


def decode_json_response(
    json_response: JsonResponse,
) -> dict[str, Any] | list[dict[str, Any]]:
    json_content_bytes = json_response.json_content.encode()
    json_str = base64.decodebytes(json_content_bytes)
    return json.loads(json_str)  # type: ignore


@singledispatch
def prepare_model_for_api(data) -> StringIO:  # type: ignore
    json_str = json.dumps(data.dict())
    string_io = StringIO(json_str)
    string_io.seek(0)
    return string_io


@prepare_model_for_api.register
def _(data: list) -> StringIO:  # type: ignore
    dicts = [d.dict() for d in data]
    json_str = json.dumps(dicts)
    string_io = StringIO(json_str)
    string_io.seek(0)
    return string_io
