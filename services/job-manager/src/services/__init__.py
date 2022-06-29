import os

ML_PIPELINE_URL: str = os.getenv("ML_PIPELINE_URL", default=None)

ML_PIPELINE_NS: str = os.getenv("ML_PIPELINE_NS", default=None)

SOLUTION_CONFIG_FILE_NAME: str = os.getenv(
    "SOLUTION_CONFIG_FILE_NAME", default="solution.json"
)

OS4ML_NAMESPACE: str = os.getenv("OS4ML_NAMESPACE", "os4ml")
