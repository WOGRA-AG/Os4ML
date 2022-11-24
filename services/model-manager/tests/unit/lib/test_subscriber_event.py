import asyncio

import pytest

from lib.subscriber_event import SubscriberEvent


@pytest.fixture
def event() -> SubscriberEvent[int]:
    return SubscriberEvent()


async def wait_event(event: SubscriberEvent, test_id: int = 1) -> int:
    await event.wait(test_id)
    return 1


@pytest.mark.asyncio
async def test_waiting_event(event):
    task = asyncio.create_task(wait_event(event))
    assert task.done() is False
    event.set()
    await asyncio.wait_for(task, timeout=1)
    assert task.result() == 1


@pytest.mark.asyncio
async def test_event_subscriptions(event):
    task = asyncio.create_task(wait_event(event, 2))
    event.set()
    await asyncio.wait_for(task, timeout=1)
    assert event.has_subscribers()
    event.unsubscribe(2)
    assert event.has_subscribers() is False


@pytest.mark.asyncio
async def test_multiple_subscribers_get_notified(event):
    task1 = asyncio.create_task(wait_event(event, 1))
    task2 = asyncio.create_task(wait_event(event, 2))
    task3 = asyncio.create_task(wait_event(event, 3))
    await asyncio.sleep(0.01)

    event.set()
    event.clear()

    gather = asyncio.gather(task1, task2, task3)
    await asyncio.wait_for(gather, timeout=1)
    assert task1.result() == 1


@pytest.mark.asyncio
async def test_waiting_on_event_multiple_times(event):
    async def wait_multiple_times(times: int) -> int:
        for _ in range(times):
            await event.wait(1)
        return 1

    task = asyncio.create_task(wait_multiple_times(3))
    for _ in range(3):
        await asyncio.sleep(0.01)
        event.set()
        event.clear()
    await asyncio.wait_for(task, timeout=0.1)
    assert task.result() == 1
    event.unsubscribe(1)
    assert event.has_subscribers() is False
