import asyncio
from asyncio import Event


class ThreadSafeEvent:
    def __init__(self) -> None:
        self._event = Event()
        self._loop = asyncio.get_event_loop()

    def set(self) -> None:
        self._loop.call_soon_threadsafe(self._event.set)

    def clear(self) -> None:
        self._loop.call_soon_threadsafe(self._event.clear)

    async def wait(self) -> None:
        await self._event.wait()
