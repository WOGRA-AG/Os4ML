from minio import Minio

from lib.singleton import Singleton
from services import STORAGE_KEY, STORAGE_SECRET, STORAGE_SECURE, STORAGE_URL


class MinioClient(Minio, metaclass=Singleton):
    pass


def get_minio_client() -> Minio:
    return MinioClient(
        endpoint=STORAGE_URL,
        access_key=STORAGE_KEY,
        secret_key=STORAGE_SECRET,
        secure=STORAGE_SECURE,
    )
