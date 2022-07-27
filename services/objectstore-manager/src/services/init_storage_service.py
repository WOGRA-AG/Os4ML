from typing import Callable, Mapping

from google.cloud.storage import Client as GcsClient
from minio import Minio

from services import (
    STORAGE_KEY,
    STORAGE_SECRET,
    STORAGE_SECURE,
    STORAGE_URL,
    GcsService,
    MinioService,
    StorageService,
)


def _init_minio() -> MinioService:
    client: Minio = Minio(
        endpoint=STORAGE_URL,
        access_key=STORAGE_KEY,
        secret_key=STORAGE_SECRET,
        secure=STORAGE_SECURE,
    )
    return MinioService(client=client)


def _init_gcs() -> GcsService:
    client: GcsClient = GcsClient()
    return GcsService(client=client)


storage_services: Mapping[str, Callable[[], StorageService]] = {
    "minio": _init_minio,
    "gcs": _init_gcs,
}
