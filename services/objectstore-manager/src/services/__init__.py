import os
from datetime import timedelta

MINIO_URL: str = os.getenv(
    "OBJECTSTORECONFIG_URL", default="minio.minio-tenant.svc.cluster.local",
)

MINIO_KEY: str = os.getenv("OBJECTSTORECONFIG_ACCESSKEY", default="minio")

MINIO_SECRET: str = os.getenv(
    "OBJECTSTORECONFIG_SECRETACCESSKEY", default="minio123"
)

MINIO_SECURE: bool = os.getenv(
    "OBJECTSTORECONFIG_SECURE", default="false"
).lower() == "true"

MINIO_BUCKET: str = os.getenv("OBJECTSTORECONFIG_BUCKETNAME", default="os4ml")

DATABAG_CONFIG_FILE_NAME: str = os.getenv(
    "DATABAG_CONFIG_FILE_NAME", default="databag.json"
)

SOLUTION_CONFIG_FILE_NAME: str = os.getenv(
    "SOLUTION_CONFIG_FILE_NAME", default="solution.json"
)

TEMPLATE_METADATA_FILE_NAME: str = os.getenv(
    "TEMPLATE_METADATA_FILE_NAME", default="metadata.json"
)

COMPONENT_FILE_NAME: str = os.getenv(
    "COMPONENT_FILE_NAME", default="component.yaml"
)

PIPELINE_FILE_NAME: str = os.getenv(
    "PIPELINE_FILE_NAME", default="pipeline.yaml"
)

EXPIRY: timedelta = timedelta(hours=2)
