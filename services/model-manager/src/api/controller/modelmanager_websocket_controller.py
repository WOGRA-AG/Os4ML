import asyncio
import uuid

from fastapi import Depends, WebSocket, WebSocketDisconnect

from lib.camel_case import convert_to_camel_case
from services.databag_service import DatabagService
from services.solution_service import SolutionService


class WebsocketController:
    def __init__(
        self,
        databag_service: DatabagService = Depends(),
        solution_service: SolutionService = Depends(),
    ):
        self.databag_service = databag_service
        self.solution_service = solution_service

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
