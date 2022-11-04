import os


OS4ML_NAMESPACE: str = os.getenv("OS4ML_NAMESPACE", default="os4ml")

DATABAG_CONFIG_FILE_NAME: str = os.getenv(
    "DATABAG_CONFIG_FILE_NAME", default="databag.json"
)

DATE_FORMAT_STR = "%Y-%m-%dT%H:%M:%SZ"
