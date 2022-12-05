import base64
from io import BytesIO

from fastapi import Depends
from fastapi.responses import RedirectResponse

from build.openapi_server.models.json_response import JsonResponse
from build.openapi_server.models.user import User
from services.auth_service import get_parsed_token
from services.storage_service import StorageService


class ObjectstoreApiController:
    def __init__(
        self,
        storage_service: StorageService = Depends(),
        user: User = Depends(get_parsed_token),
    ):

        self.storage_service = storage_service
        self.user = user

    def _add_user_prefix(self, path_name: str) -> str:
        return f"{self.user.id}/{path_name}"

    def _remove_user_prefix(self, path_name: str) -> str:
        return path_name.removeprefix(f"{self.user.id}/")

    def get_object_by_name(
        self, object_name: str, usertoken: str = ""
    ) -> RedirectResponse:
        get_url = self.storage_service.get_presigned_get_url(
            object_name=self._add_user_prefix(object_name),
        )
        return RedirectResponse(get_url)

    def put_object_by_name(
        self, object_name: str, body: bytes, usertoken: str = ""
    ) -> str:
        file = BytesIO(body)
        return self.storage_service.create_object_by_name(
            object_name=self._add_user_prefix(object_name),
            file=file,
            size=len(body),
        )

    def delete_object_by_name(
        self, object_name: str, usertoken: str = ""
    ) -> None:
        return self.storage_service.delete_object_by_name(
            object_name=self._add_user_prefix(object_name),
        )

    def get_objects_with_prefix(
        self, path_prefix: str | None, usertoken: str = ""
    ) -> list[str]:
        # can be removed after issue #289 is solved
        if path_prefix is None:
            path_prefix = ""
        objects = self.storage_service.list_objects(
            path_prefix=self._add_user_prefix(path_prefix),
        )
        return [
            self._remove_user_prefix(object_name) for object_name in objects
        ]

    def delete_objects_with_prefix(
        self, path_prefix: str | None, usertoken: str = ""
    ) -> None:
        # can be removed after issue #289 is solved
        if path_prefix is None:
            path_prefix = ""
        return self.storage_service.delete_objects(
            path_prefix=self._add_user_prefix(path_prefix),
        )

    def get_json_object_by_name(
        self, object_name: str, usertoken: str = ""
    ) -> JsonResponse:
        json_str: str = self.storage_service.get_json_object_by_name(
            object_name=self._add_user_prefix(object_name),
        )
        encoded_json_str = base64.encodebytes(json_str.encode()).decode()
        return JsonResponse(json_content=encoded_json_str)

    def get_presigned_get_url(
        self, object_name: str, usertoken: str = ""
    ) -> str:
        return self.storage_service.get_presigned_get_url(
            object_name=self._add_user_prefix(object_name),
        )

    def get_presigned_put_url(
        self, object_name: str, usertoken: str = ""
    ) -> str:
        return self.storage_service.get_presigned_put_url(
            object_name=self._add_user_prefix(object_name),
        )
