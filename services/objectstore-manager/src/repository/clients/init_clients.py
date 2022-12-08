from repository.clients.gcs_client import get_gcs_client
from repository.clients.minio_client import get_minio_client
from services import STORAGE_BACKEND


def init_clients() -> None:
    match STORAGE_BACKEND:
        case "minio":
            get_minio_client()
        case "gcs" | "google":
            get_gcs_client()
        case _:
            raise NotImplementedError(
                f"Storage Service {STORAGE_BACKEND} not implemented"
            )
