import enum
import uuid
from typing import Any, AsyncIterable

from fastapi import Depends

from src.build.objectstore_client.api.objectstore_api import ObjectstoreApi
from src.build.objectstore_client.exceptions import NotFoundException
from src.build.objectstore_client.model.json_response import JsonResponse
from src.build.openapi_server.models.model_share import ModelShare
from src.build.openapi_server.models.new_transfer_learning_model_dto import (
    NewTransferLearningModelDto,
)
from src.build.openapi_server.models.transfer_learning_model import (
    TransferLearningModel,
)
from src.exceptions.resource_not_found import (
    TransferLearningModelNotFoundException,
)
from src.lib.json_io import decode_json_response, prepare_model_for_api
from src.services import (
    TRANSFER_LEARNING_FILE_NAME,
    TRANSFER_LEARNING_MESSAGE_CHANNEL,
)
from src.services.auth_service import get_parsed_token, mock_token_with_user_id
from src.services.databag_service import DatabagService
from src.services.init_api_clients import init_objectstore_api
from src.services.messaging_service import MessagingService
from src.services.solution_service import SolutionService


class TransferLearningType(enum.Enum):
    TEXT = "text"
    IMAGE = "image"


class TransferlearningOrigin(enum.Enum):
    HUGGING_FACE = "hugging face"
    SOLUTION = "solution"
    SHARED_SOLUTION = "shared solution"
    TORCH_VISION = "torch vision"


def get_inital_transfer_learing_models() -> list[TransferLearningModel]:
    return [
        TransferLearningModel(
            id=str(uuid.uuid4()),
            name="BERT",
            type="text",
            origin=TransferlearningOrigin.HUGGING_FACE.value,
            value="bert",
        ),
        TransferLearningModel(
            id=str(uuid.uuid4()),
            name="DistilBERT",
            type="text",
            origin=TransferlearningOrigin.HUGGING_FACE.value,
            value="distilbert",
        ),
        TransferLearningModel(
            id=str(uuid.uuid4()),
            name="ALBERT",
            type="text",
            origin=TransferlearningOrigin.HUGGING_FACE.value,
            value="albert",
        ),
        TransferLearningModel(
            id=str(uuid.uuid4()),
            name="ResNet",
            type="image",
            origin=TransferlearningOrigin.TORCH_VISION.value,
            value="resnet",
        ),
        TransferLearningModel(
            id=str(uuid.uuid4()),
            name="VisionTransformer",
            type="image",
            origin=TransferlearningOrigin.TORCH_VISION.value,
            value="vit",
        ),
        TransferLearningModel(
            id=str(uuid.uuid4()),
            name="MobileNet V3",
            type="image",
            origin=TransferlearningOrigin.TORCH_VISION.value,
            value="mobilenetv3",
        ),
    ]


def format_value_str(solution_id: str, solution_input: str) -> str:
    return f"{solution_id}/{solution_input}"


def format_shared_value_str(user_id: str, current_value_str: str) -> str:
    return f"{user_id}/{current_value_str}"


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

    def get_transfer_learning_model_by_id(
        self, id: str, usertoken: str
    ) -> TransferLearningModel:
        models_with_id = [
            model
            for model in self.get_transfer_learning_models(usertoken)
            if model.id == id
        ]
        if len(models_with_id) == 0:
            raise TransferLearningModelNotFoundException(id)
        return models_with_id[0]

    def update_transfer_learning_model_by_id(
        self, id: str, updated_model: TransferLearningModel, usertoken: str
    ) -> TransferLearningModel:
        models = self.get_transfer_learning_models(usertoken)
        updated_models = [
            tl_model if not tl_model.id == id else updated_model
            for tl_model in models
        ]
        self._save_transfer_learning_models(updated_models, usertoken)
        self._notify_transfer_learning_update(usertoken)
        return updated_model

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
        return self._create_new_transfer_learning_model(tl_model, usertoken)

    def _create_new_transfer_learning_model(
        self, tl_model: TransferLearningModel, usertoken: str
    ) -> TransferLearningModel:
        tl_models = self._load_transfer_learning_models(usertoken=usertoken)
        tl_models.append(tl_model)
        self._save_transfer_learning_models(tl_models, usertoken=usertoken)
        self._notify_transfer_learning_update(usertoken)

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
        models_with_id = [model for model in tl_models if model.id == id]
        if len(models_with_id) == 0:
            return
        tl_model = models_with_id[0]
        if tl_model.model_shares is not None:
            for model_share in tl_model.model_shares:
                mock_token = mock_token_with_user_id(model_share.user_id)
                self.delete_transfer_learning_model_by_id(
                    model_share.transfer_learning_model_id, mock_token
                )
        if tl_model.share_of is not None:
            mock_token = mock_token_with_user_id(tl_model.share_of.user_id)
            shared_model = self.get_transfer_learning_model_by_id(
                tl_model.share_of.transfer_learning_model_id, mock_token
            )
            if shared_model.model_shares is not None:
                shared_model.model_shares = [
                    share
                    for share in shared_model.model_shares
                    if share.transfer_learning_model_id != id
                ]
            self.update_transfer_learning_model_by_id(
                tl_model.share_of.transfer_learning_model_id,
                shared_model,
                mock_token,
            )
        tl_models = [tl_model for tl_model in tl_models if tl_model.id != id]
        self._save_transfer_learning_models(tl_models, usertoken=usertoken)
        self._notify_transfer_learning_update(usertoken)

    def share_transfer_learning_model(
        self, tlm_id: str, user_id: str, usertoken: str
    ) -> TransferLearningModel:
        tl_model = self.get_transfer_learning_model_by_id(tlm_id, usertoken)
        if not tl_model.origin == TransferlearningOrigin.SOLUTION.value:
            raise ValueError(
                "Only transfer learning models from own solutions can be shared"
            )
        own_user_id = get_parsed_token(usertoken).id
        share_of = ModelShare(
            user_id=own_user_id, transfer_learning_model_id=tlm_id
        )
        shared_tlm = self._create_shared_tlm_for_other_user(
            tl_model, share_of, user_id
        )
        if shared_tlm.id is None:
            raise ValueError("Shared model id cannot be None")
        if tl_model.model_shares is None:
            tl_model.model_shares = []
        tl_model.model_shares.append(
            ModelShare(
                user_id=user_id, transfer_learning_model_id=shared_tlm.id
            )
        )
        self.update_transfer_learning_model_by_id(tlm_id, tl_model, usertoken)
        self._notify_transfer_learning_update(usertoken)
        return tl_model

    def _create_shared_tlm_for_other_user(
        self, tlm: TransferLearningModel, share_of: ModelShare, user_id: str
    ) -> TransferLearningModel:
        shared_tlm = TransferLearningModel(
            id=str(uuid.uuid4()),
            name=f"share of {tlm.name}",
            type=tlm.type,
            origin=TransferlearningOrigin.SHARED_SOLUTION.value,
            value=format_shared_value_str(user_id, tlm.value),  # type: ignore
            share_of=share_of,
        )
        mocked_token = mock_token_with_user_id(user_id)
        self._create_new_transfer_learning_model(shared_tlm, mocked_token)
        return shared_tlm

    def cancel_transfer_learning_model_sharing(
        self, tlm_id: str, shared_tlm_id: str, usertoken: str
    ) -> None:
        tlm = self.get_transfer_learning_model_by_id(tlm_id, usertoken)
        if tlm.model_shares is None:
            return
        model_shares = [
            share
            for share in tlm.model_shares
            if share.transfer_learning_model_id == shared_tlm_id
        ]
        for share in model_shares:
            mock_token = mock_token_with_user_id(share.user_id)
            self.delete_transfer_learning_model_by_id(
                share.transfer_learning_model_id, mock_token
            )
