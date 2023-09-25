import os

OS4ML_NAMESPACE: str = os.getenv("OS4ML_NAMESPACE", default="os4ml")

DATABAG_CONFIG_FILE_NAME: str = os.getenv(
    "DATABAG_CONFIG_FILE_NAME", default="databag.json"
)

SOLUTION_CONFIG_FILE_NAME: str = os.getenv(
    "SOLUTION_CONFIG_FILE_NAME", default="solution.json"
)

PREDICTION_CONFIG_FILE_NAME = os.getenv(
    "PREDICTION_CONFIG_FILE_NAME", default="prediction.json"
)

PREDICTION_DATA_FILE_NAME = os.getenv(
    "PREDICTION_DATA_FILE_NAME", default="prediction_data.csv"
)

PREDICTION_RESULT_FILE_NAME = os.getenv(
    "PREDICTION_RESULT_FILE_NAME", default="prediction_result.csv"
)

PREDICTION_TEMPLATE_FILE_NAME = os.getenv(
    "PREDICTION_TEMPLATE_FILE_NAME", default="prediction_template.csv"
)
TRANSFER_LEARNING_FILE_NAME = os.getenv(
    "TTRANSFER_LEARNING_FILE_NAME", default="transfer_learning.json"
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
PREDICTION_MESSAGE_CHANNEL = os.getenv(
    "PREDICTION_MESSAGE_CHANNEL", default="prediction-os4ml"
)
TRANSFER_LEARNING_MESSAGE_CHANNEL = os.getenv(
    "TRANSFER_LEARNING_MESSAGE_CHANNEL", default="transfer-learning-os4ml"
)

MESSAGE_BROKER_PUBLISH_URL = os.getenv(
    "MESSAGE_BROKER_PUBLISH_URL", default="master.redis.svc.cluster.local"
)
MESSAGE_BROKER_SUBSCRIBE_URL = os.getenv(
    "MESSAGE_BROKER_SUBSCRIBE_URL", default="replica.redis.svc.cluster.local"
)
MESSAGE_BROKER_PORT = int(os.getenv("MESSAGE_BROKER_PORT", default="6379"))
