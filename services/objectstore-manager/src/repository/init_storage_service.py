from typing import Callable, Mapping

from google.cloud.storage import Client as GcsClient
from minio import Minio

from repository import GcsRepository, MinioRepository, StorageRepository
from services import STORAGE_KEY, STORAGE_SECRET, STORAGE_SECURE, STORAGE_URL


def _init_minio() -> MinioRepository:
    client: Minio = Minio(
        endpoint=STORAGE_URL,
        access_key=STORAGE_KEY,
        secret_key=STORAGE_SECRET,
        secure=STORAGE_SECURE,
    )
    return MinioRepository(client=client)


def _init_gcs() -> GcsRepository:
    client: GcsClient = GcsClient()
    return GcsRepository(client=client)


storage_services: Mapping[str, Callable[[], StorageRepository]] = {
    "minio": _init_minio,
    "gcs": _init_gcs,
}
