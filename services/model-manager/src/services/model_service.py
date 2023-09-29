import base64
import json
import logging
import uuid
from abc import ABC, abstractmethod
from datetime import datetime
from io import BytesIO
from typing import Any, AsyncIterator, Generic, Protocol, TypeVar

from src.build.job_manager_client import ApiException, ApiTypeError
from src.build.job_manager_client.api.jobmanager_api import JobmanagerApi
from src.build.job_manager_client.model.run import Run
from src.build.job_manager_client.model.run_params import RunParams
from src.build.objectstore_client.api.objectstore_api import ObjectstoreApi
from src.build.objectstore_client.exceptions import NotFoundException
from src.build.objectstore_client.model.json_response import JsonResponse
from src.exceptions import (
    ModelIdUpdateNotAllowedException,
    ModelNotFoundException,
)
from src.services import DATE_FORMAT_STR
from src.services.auth_service import get_parsed_token
from src.services.messaging_service import MessagingService


class Model(Protocol):
    id: str
    run_id: str
    creation_time: str

    def dict(self) -> dict[str, Any]:
        pass


T = TypeVar("T", bound=Model)


class ModelService(Generic[T], ABC):
    def __init__(
        self,
        objectstore: ObjectstoreApi,
        jobmanager: JobmanagerApi,
    ):
        self.objectstore = objectstore
        self.jobmanager = jobmanager

    @property
    @abstractmethod
    def config_file_name(self) -> str:
        raise NotImplementedError

    @property
    @abstractmethod
    def messaging_service(self) -> MessagingService:
        raise NotImplementedError

    @abstractmethod
    def get_file_name(self, model: T, file_name: str, usertoken: str) -> str:
        raise NotImplementedError

    @abstractmethod
    def build_model(self, dict_: dict[str, Any]) -> T:
        raise NotImplementedError

    @property
    @abstractmethod
    def model_name(self) -> str:
        raise NotImplementedError

    @abstractmethod
    def create_run_params(self, model: T) -> RunParams:
        raise NotImplementedError

    def create_model(self, model: T, usertoken: str) -> T:
        model.id = str(uuid.uuid4())
        model.creation_time = datetime.utcnow().strftime(DATE_FORMAT_STR)
        self._persist_model(model, usertoken=usertoken)
        self._notify_model_update(usertoken)
        return model

    def get_models(self, usertoken: str) -> list[T]:
        object_names: list[str] = self.objectstore.get_objects_with_prefix(
            path_prefix="", usertoken=usertoken
        )
        return [
            self._load_model_from_object_name(object_name, usertoken)
            for object_name in object_names
            if object_name.endswith(self.config_file_name)
        ]

    def get_model_by_id(self, id_: str, usertoken: str) -> T:
        models_with_id = [
            model
            for model in self.get_models(usertoken=usertoken)
            if model.id == id_
        ]
        if not models_with_id:
            raise ModelNotFoundException(self.model_name, id_)
        return models_with_id.pop()

    def update_model_by_id(self, id_: str, model: T, usertoken: str) -> T:
        if id_ != model.id:
            raise ModelIdUpdateNotAllowedException(self.model_name)
        self._persist_model(model, usertoken=usertoken)
        self._notify_model_update(usertoken)
        return model

    def delete_model_by_id(self, id_: str, usertoken: str) -> None:
        try:
            model = self.get_model_by_id(id_, usertoken=usertoken)
        except ModelNotFoundException:
            return
        self.terminate_run_for_model(model, usertoken=usertoken)
        self.objectstore.delete_objects_with_prefix(
            path_prefix=self.get_file_name(
                model, file_name="", usertoken=usertoken
            ),
            usertoken=usertoken,
        )
        self._notify_model_update(usertoken)

    def terminate_run_for_model(self, model: T, usertoken: str) -> None:
        if model.run_id is None:
            return
        try:
            run: Run = self.jobmanager.get_run_by_id(
                model.run_id, usertoken=usertoken
            )
            if run.status == "Running":
                self.jobmanager.terminate_run_by_id(
                    model.run_id, usertoken=usertoken
                )
        except ApiException as e:
            logging.warning(e)
        except ApiTypeError as e:
            logging.error(e)

    def get_presigned_get_url(
        self, model: T, file_name: str, usertoken: str
    ) -> str | None:
        full_name = self.get_file_name(model, file_name, usertoken=usertoken)
        try:
            return self.objectstore.get_presigned_get_url(  # type: ignore
                full_name, usertoken=usertoken
            )
        except NotFoundException:
            return None

    def get_presigned_put_url(
        self, id_: str, file_name: str, usertoken: str
    ) -> str:
        model = self.get_model_by_id(id_, usertoken=usertoken)
        full_name = self.get_file_name(model, file_name, usertoken=usertoken)
        return self.objectstore.get_presigned_put_url(  # type: ignore
            full_name, usertoken=usertoken
        )

    async def stream_models(
        self, usertoken: str, client_id: uuid.UUID
    ) -> AsyncIterator[list[T]]:
        user = get_parsed_token(usertoken)
        yield self.get_models(usertoken)
        while True:
            await self.messaging_service.wait(user.id, client_id)
            yield self.get_models(usertoken)

    def terminate_model_stream(self, client_id: uuid.UUID) -> None:
        self.messaging_service.unsubscribe(client_id)

    def _notify_model_update(self, usertoken: str) -> None:
        user = get_parsed_token(usertoken)
        self.messaging_service.publish(user.id)

    def _persist_model(self, model: T, usertoken: str) -> None:
        encoded_model = BytesIO(json.dumps(model.dict()).encode())
        self.objectstore.put_object_by_name(
            object_name=self.get_file_name(
                model, self.config_file_name, usertoken
            ),
            body=encoded_model,
            usertoken=usertoken,
        )

    def _load_model_from_object_name(
        self, object_name: str, usertoken: str
    ) -> T:
        json_response: JsonResponse = self.objectstore.get_json_object_by_name(
            object_name, usertoken=usertoken
        )
        json_content_bytes = json_response.json_content.encode()
        json_str = base64.decodebytes(json_content_bytes)
        json_dict = json.loads(json_str)
        return self.build_model(json_dict)
