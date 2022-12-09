import os

OS4ML_NAMESPACE: str = os.getenv("OS4ML_NAMESPACE", default="os4ml")

DATABAG_CONFIG_FILE_NAME: str = os.getenv(
    "DATABAG_CONFIG_FILE_NAME", default="databag.json"
)

SOLUTION_CONFIG_FILE_NAME: str = os.getenv(
    "SOLUTION_CONFIG_FILE_NAME", default="solution.json"
)

MODEL_FILE_NAME = "model.os4ml.zip"
DATAFRAME_FILE_NAME = "dataframe"
DATE_FORMAT_STR = "%Y-%m-%dT%H:%M:%SZ"


DATABAG_MESSAGE_CHANNEL = os.getenv(
    "DATABAG_MESSAGE_CHANNEL", default="databag-os4ml"
)
SOLUTION_MESSAGE_CHANNEL = os.getenv(
    "SOLUTION_MESSAGE_CHANNEL", default="solution-os4ml"
)
MESSAGE_BROKER_PUBLISH_URL = os.getenv(
    "MESSAGE_BROKER_PUBLISH_URL", default="master.redis.svc.cluster.local"
)
MESSAGE_BROKER_SUBSCRIBE_URL = os.getenv(
    "MESSAGE_BROKER_SUBSCRIBE_URL", default="replica.redis.svc.cluster.local"
)
MESSAGE_BROKER_PORT = os.getenv("MESSAGE_BROKER_PORT", default=6379)
