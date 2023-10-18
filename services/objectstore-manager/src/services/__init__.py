import os

STORAGE_BACKEND: str = os.getenv(
    "OBJECTSTORE_STORAGE_BACKEND", default="minio"
)

STORAGE_URL: str = os.getenv(
    "OBJECTSTORECONFIG_URL",
    default="minio.minio-tenant.svc.cluster.local",
)

STORAGE_KEY: str = os.getenv("OBJECTSTORECONFIG_ACCESSKEY", default="minio")

STORAGE_SECRET: str = os.getenv(
    "OBJECTSTORECONFIG_SECRETACCESSKEY",
    default="minio123",
)

STORAGE_SECURE: bool = (
    os.getenv("OBJECTSTORECONFIG_SECURE", default="false").lower() == "true"
)

BUCKET_NAME: str = os.getenv("OS4ML_BUCKET_NAME", default="os4ml")
