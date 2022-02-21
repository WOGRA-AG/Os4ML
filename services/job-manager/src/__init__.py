import os

ML_PIPELINE_URL: str = None if os.getenv("ML_PIPELINE_URL") is None else os.getenv("ML_PIPELINE_URL")

ML_PIPELINE_NS: str = None if os.getenv("ML_PIPELINE_NS") is None else os.getenv("ML_PIPELINE_NS")
