import pytest

from services.messaging_service import MessagingService


@pytest.fixture(autouse=True)
def terminate_threads():
    yield None
    MessagingService.terminate_threads()
