import asyncio
import uuid

from fastapi import Depends, WebSocket, WebSocketDisconnect

from src.lib.camel_case import convert_to_camel_case
from src.services.databag_service import DatabagService
from src.services.prediction_service import PredictionSerivce
from src.services.solution_service import SolutionService
from src.services.transfer_learning_service import TransferLearningService


class WebsocketController:
    def __init__(
        self,
        databag_service: DatabagService = Depends(),
        solution_service: SolutionService = Depends(),
        prediction_service: PredictionSerivce = Depends(),
        transfer_learning_service: TransferLearningService = Depends(),
    ):
        self.databag_service = databag_service
        self.solution_service = solution_service
        self.prediction_service = prediction_service
        self.transfer_learning_service = transfer_learning_service

    async def stream_databags(
        self, websocket: WebSocket, usertoken: str
    ) -> None:
        await websocket.accept()
        client_id = uuid.uuid4()
        task = None
        try:
            # see issue https://github.com/tiangolo/fastapi/issues/3934
            task = asyncio.create_task(
                self._stream_databags(websocket, usertoken, client_id)
            )
            while True:
                await websocket.receive_text()
        except WebSocketDisconnect:
            if task:
                task.cancel()
            self.databag_service.terminate_databags_stream(client_id)

    async def _stream_databags(
        self, websocket: WebSocket, usertoken: str, client_id: uuid.UUID
    ) -> None:
        async for databags in self.databag_service.stream_databags(
            usertoken, client_id
        ):
            databag_dicts = [databag.dict() for databag in databags]
            camel_case_databag_dicts = convert_to_camel_case(databag_dicts)
            await websocket.send_json(camel_case_databag_dicts)

    async def stream_solutions(
        self, websocket: WebSocket, usertoken: str
    ) -> None:
        await websocket.accept()
        client_id = uuid.uuid4()
        task = None
        try:
            # see issue https://github.com/tiangolo/fastapi/issues/3934
            task = asyncio.create_task(
                self._stream_solutions(websocket, usertoken, client_id)
            )
            while True:
                await websocket.receive_text()
        except WebSocketDisconnect:
            if task:
                task.cancel()
            self.solution_service.terminate_solutions_stream(client_id)

    async def _stream_solutions(
        self, websocket: WebSocket, usertoken: str, client_id: uuid.UUID
    ) -> None:
        async for solutions in self.solution_service.stream_solutions(
            usertoken, client_id
        ):
            solution_dicts = [solution.dict() for solution in solutions]
            camel_case_solution_dicts = convert_to_camel_case(solution_dicts)
            await websocket.send_json(camel_case_solution_dicts)

    async def stream_predictions(
        self, websocket: WebSocket, usertoken: str
    ) -> None:
        await websocket.accept()
        client_id = uuid.uuid4()
        task = None
        try:
            # see issue https://github.com/tiangolo/fastapi/issues/3934
            task = asyncio.create_task(
                self._stream_predictions(websocket, usertoken, client_id)
            )
            while True:
                await websocket.receive_text()
        except WebSocketDisconnect:
            if task:
                task.cancel()
            self.prediction_service.terminate_predictions_stream(client_id)

    async def _stream_predictions(
        self, websocket: WebSocket, usertoken: str, client_id: uuid.UUID
    ) -> None:
        async for predictions in self.prediction_service.stream_predictions(
            usertoken, client_id
        ):
            prediction_dicts = [
                prediction.dict() for prediction in predictions
            ]
            camel_case_predictions_dicts = convert_to_camel_case(
                prediction_dicts
            )
            await websocket.send_json(camel_case_predictions_dicts)

    async def stream_transfer_learning_models(
        self, websocket: WebSocket, usertoken: str
    ) -> None:
        await websocket.accept()
        task = None
        client_id = uuid.uuid4()
        try:
            # see issue https://github.com/tiangolo/fastapi/issues/3934
            task = asyncio.create_task(
                self._stream_transfer_learning_models(
                    websocket, usertoken, client_id
                )
            )
            while True:
                await websocket.receive_text()
        except WebSocketDisconnect:
            if task:
                task.cancel()
            self.transfer_learning_service.terminate_transfer_learning_models_stream(
                client_id
            )

    async def _stream_transfer_learning_models(
        self, websocket: WebSocket, usertoken: str, client_id: uuid.UUID
    ) -> None:
        async for transfer_learning_models in self.transfer_learning_service.stream_transfer_learning_models(
            usertoken, client_id
        ):
            transfer_learning_model_dicts = [
                transfer_learning_model.dict()
                for transfer_learning_model in transfer_learning_models
            ]
            camel_case_transfer_learning_model_dicts = convert_to_camel_case(
                transfer_learning_model_dicts
            )
            await websocket.send_json(camel_case_transfer_learning_model_dicts)
