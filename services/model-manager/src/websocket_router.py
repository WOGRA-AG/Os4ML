import asyncio

from fastapi import APIRouter, WebSocket

router = APIRouter()


@router.websocket("/apis/v1beta1/model-manager/databags")
async def stream_all_databags(websocket: WebSocket) -> None:
    await websocket.accept()
    while True:
        await websocket.send_text("This is a message from the websocket")
        await asyncio.sleep(1)
