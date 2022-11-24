import asyncio
from typing import Generic, TypeVar

T = TypeVar("T")


class SubscriberEvent(Generic[T]):
    def __init__(self) -> None:
        self._event = asyncio.Event()
        self._subscribers: set[T] = set()

    def set(self) -> None:
        self._event.set()

    def clear(self) -> None:
        self._event.clear()

    async def wait(self, id_: T) -> None:
        self._subscribers.add(id_)
        await self._event.wait()

    def unsubscribe(self, id_: T) -> None:
        try:
            self._subscribers.remove(id_)
        except KeyError:
            pass

    def has_subscribers(self) -> bool:
        return len(self._subscribers) > 0
