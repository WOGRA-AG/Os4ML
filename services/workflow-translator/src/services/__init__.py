import os

WORKFLOW_ENGINE: str = os.getenv("ENGINE", default="kubeflow")

PIPELINE_TEMPLATES_DIR = "/pipelines"
# PIPELINE_TEMPLATES_DIR = (
#     "../../templates/pipelines"  # for local development
# )
PIPELINE_FILE_NAME = "pipeline.yaml"
USER_TOKEN_ANNOTATION = "os4ml.com/access_token"
USER_TOKEN_ENV = {
    "name": "OS4ML_ACCESS_TOKEN",
    "valueFrom": {
        "fieldRef": {
            "fieldPath": f"metadata.annotations['{USER_TOKEN_ANNOTATION}']"
        }
    },
}

OS4ML_NAMESPACE: str = os.getenv("OS4ML_NAMESPACE", default="os4ml")
OS4ML_NAMESPACE_ENV = {"name": "OS4ML_NAMESPACE", "value": OS4ML_NAMESPACE}
