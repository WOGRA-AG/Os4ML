import os

ML_PIPELINE_URL: str = None if os.getenv("ML_PIPELINE_URL") is None else os.getenv("ML_PIPELINE_URL")

ML_PIPELINE_NS: str = None if os.getenv("ML_PIPELINE_NS") is None else os.getenv("ML_PIPELINE_NS")

SOLUTION_CONFIG_FILE_NAME: str = (
    "solution.json" if os.getenv("SOLUTION_CONFIG_FILE_NAME") is None else os.getenv("SOLUTION_CONFIG_FILE_NAME")
)
