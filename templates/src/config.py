import os

MODEL_DIR_NAME = os.getenv("MODEL_DIR", default="model.os4ml")

USER_TOKEN = os.getenv("OS4ML_ACCESS_TOKEN", default="")

DATE_FORMAT_STR = "%Y-%m-%dT%H:%M:%SZ"
