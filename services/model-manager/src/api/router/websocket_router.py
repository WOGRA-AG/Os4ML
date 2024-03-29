from fastapi import APIRouter, Depends, Query, WebSocket

from src.api.controller.modelmanager_websocket_controller import (
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


@router.websocket("/apis/v1beta1/model-manager/predictions")
async def stream_predictions(
    websocket: WebSocket,
    usertoken: str = Query(None, description=""),
    _controller: WebsocketController = Depends(),
) -> None:
    await _controller.stream_predictions(websocket, usertoken=usertoken)


@router.websocket("/apis/v1beta1/model-manager/transfer-learning-models")
async def stream_transfer_learning_models(
    websocket: WebSocket,
    usertoken: str = Query(None, description=""),
    _controller: WebsocketController = Depends(),
) -> None:
    await _controller.stream_transfer_learning_models(
        websocket, usertoken=usertoken
    )
