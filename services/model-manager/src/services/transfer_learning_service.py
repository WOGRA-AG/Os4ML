import enum
import uuid
from typing import Any, AsyncIterable

from fastapi import Depends

from src.build.objectstore_client.api.objectstore_api import ObjectstoreApi
from src.build.objectstore_client.exceptions import NotFoundException
from src.build.objectstore_client.model.json_response import JsonResponse
from src.build.openapi_server.models.new_transfer_learning_model_dto import (
    NewTransferLearningModelDto,
)
from src.build.openapi_server.models.transfer_learning_model import (
    TransferLearningModel,
)
from src.lib.json_io import decode_json_response, prepare_model_for_api
from src.services import (
    TRANSFER_LEARNING_FILE_NAME,
    TRANSFER_LEARNING_MESSAGE_CHANNEL,
)
from src.services.auth_service import get_parsed_token
from src.services.databag_service import DatabagService
from src.services.init_api_clients import init_objectstore_api
from src.services.messaging_service import MessagingService
from src.services.solution_service import SolutionService


class TransferLearningType(enum.Enum):
    TEXT = "text"
    IMAGE = "image"


class TransferlearningOrigin(enum.Enum):
    HUGGING_FACE = "hugging_face"
    SOLUTION = "solution"


def get_inital_transfer_learing_models() -> list[TransferLearningModel]:
    return [
        TransferLearningModel(
            id=str(uuid.uuid4()),
            name="bert",
            type="text",
            origin=TransferlearningOrigin.HUGGING_FACE.value,
            value="bert",
        )
    ]


def format_value_str(solution_id: str, solution_input: str) -> str:
    return f"{solution_id}/{solution_input}"


class TransferLearningService:
    messaging_service = MessagingService(TRANSFER_LEARNING_MESSAGE_CHANNEL)

    def __init__(
        self,
        objectstore: ObjectstoreApi = Depends(init_objectstore_api),
        solution_service: SolutionService = Depends(),
        databag_service: DatabagService = Depends(),
    ):
        self.objectstore = objectstore
        self.solution_service = solution_service
        self.databag_service = databag_service

    def _save_transfer_learning_models(
        self,
        transfer_learning_models: list[TransferLearningModel],
        usertoken: str,
    ) -> None:
        data = prepare_model_for_api(transfer_learning_models)
        self.objectstore.put_object_by_name(
            TRANSFER_LEARNING_FILE_NAME, body=data, usertoken=usertoken
        )
        self._notify_transfer_learning_update(usertoken)

    def _load_transfer_learning_models(
        self, usertoken: str
    ) -> list[TransferLearningModel]:
        try:
            json_response: JsonResponse = (
                self.objectstore.get_json_object_by_name(
                    TRANSFER_LEARNING_FILE_NAME, usertoken=usertoken
                )
            )
            json_dicts: list[dict[str, Any]] = decode_json_response(  # type: ignore
                json_response
            )
            return [
                TransferLearningModel(**json_dict) for json_dict in json_dicts
            ]
        except NotFoundException:
            transfer_learning_models = get_inital_transfer_learing_models()
            self._save_transfer_learning_models(
                transfer_learning_models, usertoken
            )
            return transfer_learning_models

    def get_transfer_learning_models(
        self, usertoken: str
    ) -> list[TransferLearningModel]:
        return self._load_transfer_learning_models(usertoken)

    async def stream_transfer_learning_models(
        self, usertoken: str, client_id: uuid.UUID
    ) -> AsyncIterable[list[TransferLearningModel]]:
        user = get_parsed_token(usertoken)
        yield self.get_transfer_learning_models(usertoken)
        while True:
            await self.messaging_service.wait(user.id, client_id)
            yield self.get_transfer_learning_models(usertoken)

    def _notify_transfer_learning_update(self, usertoken: str) -> None:
        user = get_parsed_token(usertoken)
        self.messaging_service.publish(user.id)

    def terminate_transfer_learning_models_stream(
        self, client_id: uuid.UUID
    ) -> None:
        self.messaging_service.unsubscribe(client_id)

    def create_new_transfer_learning_model_from_solution(
        self, new_model_dto: NewTransferLearningModelDto, usertoken: str
    ) -> TransferLearningModel:
        type_ = self._get_type_of_input_field(
            new_model_dto.solution_id,
            new_model_dto.selected_solution_input,
            usertoken=usertoken,
        )
        value = format_value_str(
            new_model_dto.solution_id,
            new_model_dto.selected_solution_input,
        )
        tl_model = TransferLearningModel(
            id=str(uuid.uuid4()),
            name=new_model_dto.name,
            type=type_,
            origin=TransferlearningOrigin.SOLUTION.value,
            value=value,
        )

        tl_models = self._load_transfer_learning_models(usertoken=usertoken)
        tl_models.append(tl_model)
        self._save_transfer_learning_models(tl_models, usertoken=usertoken)

        return tl_model

    def _get_type_of_input_field(
        self, solution_id: str, solution_input: str, usertoken: str
    ) -> str:
        solution = self.solution_service.get_solution_by_id(
            solution_id, usertoken=usertoken
        )
        databag = self.databag_service.get_databag_by_id(
            solution.databag_id, usertoken=usertoken  # type: ignore
        )
        for col in databag.columns:  # type: ignore
            if solution_input == col.name:
                return col.type  # type: ignore
        raise ValueError(f"Unknown input field: {solution_input}")

    def delete_transfer_learning_model_by_id(
        self, id: str, usertoken: str
    ) -> None:
        tl_models = self._load_transfer_learning_models(usertoken=usertoken)
        tl_models = [tl_model for tl_model in tl_models if tl_model.id != id]
        self._save_transfer_learning_models(tl_models, usertoken=usertoken)
