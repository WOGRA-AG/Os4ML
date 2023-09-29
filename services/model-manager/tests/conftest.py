from src.services.messaging_service import MessagingService


async def mock_listen_to_channel(_) -> None:
    pass


# overwrite _listen_to_channel method so the service does not try to connect to redis
MessagingService._listen_to_channel = mock_listen_to_channel
