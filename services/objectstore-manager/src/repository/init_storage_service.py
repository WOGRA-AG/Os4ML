from repository import GcsRepository, MinioRepository, StorageRepository
from services import STORAGE_BACKEND


def init_repository() -> StorageRepository:
    match STORAGE_BACKEND:
        case "minio":
            return MinioRepository()
        case "gcs" | "google":
            return GcsRepository()
        case _:
            raise NotImplementedError(
                f"Storage Service {STORAGE_BACKEND} not implemented"
            )
