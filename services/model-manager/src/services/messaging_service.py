import asyncio
import functools
import logging
import uuid
from collections import defaultdict
from collections.abc import AsyncIterator
from threading import Thread

from redis import Redis
from redis.asyncio import Redis as AsyncRedis
from redis.exceptions import ConnectionError as RedisConnectionError

from lib.subscriber_event import SubscriberEvent
from services import (
    MESSAGE_BROKER_PORT,
    MESSAGE_BROKER_PUBLISH_URL,
    MESSAGE_BROKER_SUBSCRIBE_URL,
)


class MessagingService:
    """
    Service that publishes messages in a redis pub/sub channel and waits for specific messages.
    """

    publish_client = Redis(
        host=MESSAGE_BROKER_PUBLISH_URL, port=MESSAGE_BROKER_PORT
    )
    subscribe_client = AsyncRedis(host=MESSAGE_BROKER_SUBSCRIBE_URL, port=MESSAGE_BROKER_PORT)  # type: ignore
    terminate = False

    @staticmethod
    def terminate_threads() -> None:
        MessagingService.terminate = True

    def __init__(self, channel: str):
        self.channel = channel
        self._messageToEvent: dict[
            str, SubscriberEvent[uuid.UUID]
        ] = defaultdict(SubscriberEvent)
        self._clientToMessage: dict[uuid.UUID, str] = {}
        thread = Thread(
            target=functools.partial(asyncio.run, self._listen_to_channel())
        )
        thread.start()

    def publish(self, message: str) -> None:
        """Publishes a message in the channel."""
        self.publish_client.publish(self.channel, message)

    async def _listen_to_channel(self) -> None:
        """Listens to the messages of the channel and notifies the clients waiting for the messages."""
        while not self.terminate:
            try:
                async for message in self._iter_channel():
                    event = self._messageToEvent[message]
                    event.set()
                    event.clear()
            except RedisConnectionError:
                logging.warning(
                    "Lost connection to the redis server. Trying to reconnect..."
                )

    async def _iter_channel(self) -> AsyncIterator[str]:
        """Iterates over the messages of the channel"""
        pubsub = self.subscribe_client.pubsub()
        await pubsub.subscribe(self.channel)
        while not self.terminate:
            message = await pubsub.get_message(
                ignore_subscribe_messages=True, timeout=1
            )
            if message is not None:
                yield message["data"].decode()

    async def wait(self, message: str, client_id: uuid.UUID) -> None:
        """Waits until the specific messages is published in the channel."""
        self._clientToMessage[client_id] = message
        await self._messageToEvent[message].wait(client_id)

    def unsubscribe(self, client_id: uuid.UUID) -> None:
        """Unsubscribes the client with client_id."""
        message = self._clientToMessage[client_id]
        event = self._messageToEvent[message]
        event.unsubscribe(client_id)
        if not event.has_subscribers():
            del self._messageToEvent[message]
        del self._clientToMessage[client_id]
