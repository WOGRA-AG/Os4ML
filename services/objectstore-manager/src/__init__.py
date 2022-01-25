import os
from datetime import timedelta

MINIO_URL: str = "minio.os4ml-minio-tenant.svc.cluster.local" if os.getenv(
    "OBJECTSTORECONFIG_URL"
) is None else os.getenv("OBJECTSTORECONFIG_URL")
MINIO_KEY: str = "minio" if os.getenv("OBJECTSTORECONFIG_ACCESSKEY") is None else os.getenv(
    "OBJECTSTORECONFIG_ACCESSKEY"
)
MINIO_SECRET: str = "minio123" if os.getenv("OBJECTSTORECONFIG_SECRETACCESSKEY") is None else os.getenv(
    "OBJECTSTORECONFIG_SECRETACCESSKEY"
)
MINIO_SECURE: bool = False if os.getenv("OBJECTSTORECONFIG_SECURE") is None else os.getenv(
    "OBJECTSTORECONFIG_SECURE"
).lower() == "true"
MINIO_BUCKET: str = "os4ml" if os.getenv("OBJECTSTORECONFIG_BUCKETNAME") is None else os.getenv(
    "OBJECTSTORECONFIG_BUCKETNAME"
)
EXPIRY: timedelta = timedelta(hours=2)
