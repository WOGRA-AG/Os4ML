from typing import Optional

from kfp_server_api import (
    ApiExperiment,
    ApiListExperimentsResponse,
    ApiListPipelinesResponse,
    ApiListRunsResponse,
    ApiPipeline,
    ApiRun,
    ApiRunDetail,
)


class KfpMockClient:
    def __init__(
        self,
        host=None,
        client_id=None,
        namespace="kubeflow",
        other_client_id=None,
        other_client_secret=None,
        existing_token=None,
        cookies=None,
        proxy=None,
        ssl_ca_cert=None,
        kube_context=None,
        credentials=None,
        ui_host=None,
    ):
        pass

    def get_user_namespace(self) -> str:
        return "os4ml"

    def list_experiments(
        self, page_token="", page_size=10, sort_by="", namespace=None, filter=None
    ) -> ApiListExperimentsResponse:
        return ApiListExperimentsResponse(experiments=[ApiExperiment(id="", name="", description="")], total_size=None)

    def create_experiment(self, name: str, description: str = None, namespace: str = None) -> ApiExperiment:
        return ApiExperiment(id="", name=name, description=description)

    def list_pipelines(self, page_token="", page_size=10, sort_by="", filter=None) -> ApiListPipelinesResponse:
        return ApiListPipelinesResponse(pipelines=[ApiPipeline(id="", name="", description="")], total_size=None)

    def upload_pipeline(
        self, pipeline_package_path: str = None, pipeline_name: str = None, description: str = None
    ) -> ApiPipeline:
        return ApiPipeline(id="", name=pipeline_name, description=description)

    def list_runs(
        self, page_token="", page_size=10, sort_by="", experiment_id=None, namespace=None, filter=None
    ) -> ApiListRunsResponse:
        return ApiListRunsResponse(runs=[ApiRun(id="", name="", description="", status="", error=None)])

    def run_pipeline(
        self,
        experiment_id: str,
        job_name: str,
        pipeline_package_path: Optional[str] = None,
        params: Optional[dict] = None,
        pipeline_id: Optional[str] = None,
        version_id: Optional[str] = None,
        pipeline_root: Optional[str] = None,
        enable_caching: Optional[str] = None,
        service_account: Optional[str] = None,
    ) -> ApiRun:
        return ApiRun(id="", name=job_name, description="", service_account=service_account, status="", error=None)

    def get_run(self, run_id: str) -> ApiRunDetail:
        return ApiRunDetail(run=ApiRun(id="", name="", description="", status="", error=None))
