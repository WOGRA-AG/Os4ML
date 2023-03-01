from fastapi import APIRouter, Depends, Query, WebSocket

from api.controller.modelmanager_websocket_controller import (
    WebsocketController,
)

router = APIRouter()


@router.websocket("/apis/v1beta1/model-manager/databags")
async def stream_databags(
    websocket: WebSocket,
    usertoken: str = Query(None, description=""),
    _controller: WebsocketController = Depends(),
) -> None:
    await _controller.stream_databags(websocket, usertoken=usertoken)


@router.websocket("/apis/v1beta1/model-manager/solutions")
async def stream_solutions(
    websocket: WebSocket,
    usertoken: str = Query(None, description=""),
    _controller: WebsocketController = Depends(),
) -> None:
    await _controller.stream_solutions(websocket, usertoken=usertoken)