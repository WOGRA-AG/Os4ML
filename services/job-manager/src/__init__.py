import os

ML_PIPELINE_URL: str = "http://ml-pipeline-ui.kubeflow:80" if os.getenv(
    "MLPIPELINE_URL"
) is None else os.getenv("MLPIPELINE_URL")
