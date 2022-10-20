from google.cloud.storage import Client as GcsClient
from minio import Minio

from repository import GcsRepository, MinioRepository, StorageRepository
from services import (
    STORAGE_BACKEND,
    STORAGE_KEY,
    STORAGE_SECRET,
    STORAGE_SECURE,
    STORAGE_URL,
)


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


def init_repository() -> StorageRepository:
    match STORAGE_BACKEND:
        case "minio":
            return _init_minio()
        case "gcs":
            return _init_gcs()
        case _:
            raise NotImplementedError(
                f"Storage Service {STORAGE_BACKEND} not implemented"
            )
