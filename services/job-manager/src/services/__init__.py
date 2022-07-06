import os

ML_PIPELINE_URL: str = os.getenv("ML_PIPELINE_URL", default=None)

ML_PIPELINE_NS: str = os.getenv("ML_PIPELINE_NS", default=None)

SOLUTION_CONFIG_FILE_NAME: str = os.getenv(
    "SOLUTION_CONFIG_FILE_NAME", default="solution.json"
)

OS4ML_NAMESPACE: str = os.getenv("OS4ML_NAMESPACE", default="os4ml")

# PIPELINE_TEMPLATES_DIR = "/pipelines/"
PIPELINE_TEMPLATES_DIR = "/home/dennis/Projects/os4ml/templates/pipelines/"
TEMPLATE_METADATA_FILE_NAME: str = "metadata.json"
PIPELINE_FILE_NAME = "pipeline.yaml"
