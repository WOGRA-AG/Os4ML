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
DATABAG_CONFIG_FILE_NAME: str = "databag.json" if os.getenv("DATABAG_CONFIG_FILE_NAME") is None else os.getenv(
    "DATABAG_CONFIG_FILE_NAME"
)
SOLUTION_CONFIG_FILE_NAME: str = "solution.json" if os.getenv("SOLUTION_CONFIG_FILE_NAME") is None else os.getenv(
    "SOLUTION_CONFIG_FILE_NAME"
)
TEMPLATE_METADATA_FILE_NAME: str = "metadata.json" if os.getenv("TEMPLATE_METADATA_FILE_NAME") is None else os.getenv(
    "TEMPLATE_METADATA_FILE_NAME"
)
COMPONENT_FILE_NAME: str = "component.yaml" if os.getenv("COMPONENT_FILE_NAME") is None else os.getenv(
    "COMPONENT_FILE_NAME"
)
PIPELINE_FILE_NAME: str = "pipeline.yaml" if os.getenv("PIPELINE_FILE_NAME") is None else os.getenv(
    "PIPELINE_FILE_NAME"
)
EXPIRY: timedelta = timedelta(hours=2)
