import base64
from io import BytesIO
from typing import List

from fastapi import Depends, HTTPException
from fastapi.responses import RedirectResponse
from starlette import status

from build.openapi_server.models.bucket import Bucket
from build.openapi_server.models.databag import Databag
from build.openapi_server.models.item import Item
from build.openapi_server.models.json_response import JsonResponse
from build.openapi_server.models.user import User
from exceptions.DatabagNotFoundException import DatabagNotFoundException
from services import BUCKET_NAME
from services.auth_service import get_parsed_token
from services.databag_service import DatabagService
from services.storage_service import StorageService


class ObjectstoreApiController:
    def __init__(
        self,
        storage_service: StorageService = Depends(),
        databag_service: DatabagService = Depends(),
        user: User = Depends(get_parsed_token),
        bucket_name: str = BUCKET_NAME,
    ):

        self.storage_service = storage_service
        self.databag_service = databag_service
        self.user = user
        self.bucket_name = bucket_name

    def delete_object_by_name(
        self, bucket_name: str, object_name: str, usertoken: str = ""
    ) -> None:
        object_name = (
            object_name
            if object_name.startswith(self.user.id)
            else f"{self.user.id}/{object_name}"
        )
        return self.storage_service.delete_object_by_name(
            bucket_name=bucket_name,
            object_name=object_name,
        )

    def get_objects(
        self, bucket_name: str, path_prefix: str, usertoken: str = ""
    ) -> List[Item]:
        # can be removed after issue #289 is solved
        if not path_prefix:
            path_prefix = ""
        path_prefix = (
            path_prefix
            if path_prefix.startswith(self.user.id)
            else f"{self.user.id}/{path_prefix}"
        )
        item_list: List[Item] = self.storage_service.list_objects(
            bucket_name=bucket_name, path_prefix=path_prefix
        )
        return [
            Item(
                bucket_name=item.bucket_name,
                object_name=item.object_name.removeprefix(f"{self.user.id}/"),
            )
            for item in item_list
        ]

    def get_object_by_name(
        self, bucket_name: str, object_name: str, usertoken: str = ""
    ) -> RedirectResponse:
        object_name = (
            object_name
            if object_name.startswith(self.user.id)
            else f"{self.user.id}/{object_name}"
        )
        url = self.storage_service.get_object_by_name(
            bucket_name=bucket_name, object_name=object_name
        )
        return RedirectResponse(url)

    def get_json_object_by_name(
        self, bucket_name: str, object_name: str, usertoken: str = ""
    ) -> JsonResponse:
        object_name = (
            object_name
            if object_name.startswith(self.user.id)
            else f"{self.user.id}/{object_name}"
        )
        json_str: str = self.storage_service.get_json_object_by_name(
            bucket_name=bucket_name,
            object_name=object_name,
        )
        encoded_json_str = base64.encodebytes(json_str.encode()).decode()
        return JsonResponse(json_content=encoded_json_str)

    def get_object_url(self, object_name: str, usertoken: str = "") -> str:
        object_name = (
            object_name
            if object_name.startswith(self.user.id)
            else f"{self.user.id}/{object_name}"
        )
        return self.storage_service.get_presigned_object_url(
            bucket_name=self.bucket_name, object_name=object_name
        )

    def get_presigned_put_url(
        self, object_name: str, usertoken: str = ""
    ) -> str:
        object_name = (
            object_name
            if object_name.startswith(self.user.id)
            else f"{self.user.id}/{object_name}"
        )
        return self.storage_service.get_presigned_put_url(
            bucket_name=self.bucket_name, object_name=object_name
        )

    def put_object_by_name(
        self,
        bucket_name: str,
        object_name: str,
        body: bytes,
        usertoken: str = "",
    ) -> Item:
        file: BytesIO = BytesIO(body)
        object_name = (
            object_name
            if object_name.startswith(self.user.id)
            else f"{self.user.id}/{object_name}"
        )
        item: Item = self.storage_service.create_item_by_name(
            bucket_name=bucket_name,
            object_name=object_name,
            file=file,
            size=len(body),
        )
        return Item(
            bucket_name=item.bucket_name,
            object_name=item.object_name.removeprefix(f"{self.user.id}/"),
        )

    def delete_bucket(self, bucket_name: str, usertoken: str = "") -> None:
        return self.storage_service.delete_bucket(bucket_name=bucket_name)

    def post_new_bucket(self, bucket_name: str, usertoken: str = "") -> str:
        return self.storage_service.create_bucket(bucket_name=bucket_name)

    def get_all_buckets(self, usertoken: str = "") -> List[Bucket]:
        return self.storage_service.list_buckets()

    def delete_objects(
        self, bucket_name: str, path_prefix: str, usertoken: str = ""
    ) -> None:
        # can be removed after issue #289 is solved
        if not path_prefix:
            path_prefix = ""
        path_prefix = (
            path_prefix
            if path_prefix.startswith(self.user.id)
            else f"{self.user.id}/{path_prefix}"
        )
        return self.storage_service.delete_objects(
            bucket_name=bucket_name, path_prefix=path_prefix
        )

    def get_all_databags(self, usertoken: str = "") -> List[Databag]:
        return self.databag_service.get_databags(
            bucket_name=self.bucket_name, user_id=self.user.id
        )

    def get_databag_by_run_id(
        self, run_id: str, usertoken: str = ""
    ) -> Databag:
        try:
            return self.databag_service.get_databag_by_run_id(
                bucket_name=self.bucket_name,
                run_id=run_id,
                user_id=self.user.id,
            )
        except DatabagNotFoundException as err:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail=str(err)
            )

    def delete_databag(self, databag_id: str, usertoken: str = "") -> None:
        return self.databag_service.delete_databag_by_id(
            bucket_name=self.bucket_name,
            databag_id=databag_id,
            user_token=usertoken,
            user_id=self.user.id,
        )

    def get_databag_by_id(
        self, databag_id: str, usertoken: str = ""
    ) -> Databag:
        try:
            return self.databag_service.get_databag_by_id(
                bucket_name=self.bucket_name,
                databag_id=databag_id,
                user_id=self.user.id,
            )
        except DatabagNotFoundException as err:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail=str(err)
            )

    def post_new_databag(self, databag_id: str, usertoken: str = "") -> str:
        return self.databag_service.create_databag(
            bucket_name=self.bucket_name,
            databag_id=databag_id,
            user_id=self.user.id,
        )

    def put_databag_by_id(
        self, databag_id: str, databag: Databag, usertoken: str = ""
    ) -> str:
        return self.databag_service.update_databag(
            bucket_name=self.bucket_name,
            databag_id=databag_id,
            databag=databag,
            user_id=self.user.id,
        )

    def put_dataset_by_databag_id(
        self,
        databag_id: str,
        object_name: str,
        body: bytes,
        usertoken: str = "",
    ) -> Item:
        object_name = f"{databag_id}/{object_name}"
        item: Item = self.put_object_by_name(
            bucket_name=self.bucket_name,
            object_name=object_name,
            body=body,
            usertoken=usertoken,
        )
        return Item(
            bucket_name=item.bucket_name,
            object_name=item.object_name.removeprefix(f"{self.user.id}/"),
        )
