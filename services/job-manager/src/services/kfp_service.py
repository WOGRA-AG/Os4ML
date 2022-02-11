from typing import List
from urllib.request import urlretrieve

from kfp import Client
from kfp_server_api import ApiListExperimentsResponse, ApiListPipelinesResponse, ApiListRunsResponse, ApiRun

from src import ML_PIPELINE_NS, ML_PIPELINE_URL
from src.models import CreatePipeline, CreateRun, Experiment, Pipeline, Run


class KfpService:
    def __init__(self, host: str = ML_PIPELINE_URL, namespace: str = ML_PIPELINE_NS, client=None):
        self.host = host
        self.namespace = namespace
        self.client = client if client is not None else self.init_client()
        self.usernamespace = self.client.get_user_namespace()

    def init_client(self) -> Client:
        return Client(self.host, self.namespace)

    def get_all_experiments(self) -> List[Experiment]:
        experiments: ApiListExperimentsResponse = self.client.list_experiments(namespace=self.usernamespace)
        return (
            [Experiment(id=exp.id, name=exp.name, description=exp.description) for exp in experiments.experiments]
            if experiments.experiments is not None
            else []
        )

    def create_experiment(self, experiment: Experiment) -> None:
        self.client.create_experiment(experiment.name, experiment.description, namespace=self.usernamespace)

    def get_all_pipelines(self) -> List[Pipeline]:
        pipelines: ApiListPipelinesResponse = self.client.list_pipelines()
        return (
            [Pipeline(id=pipe.id, name=pipe.name, description=pipe.description) for pipe in pipelines.pipelines]
            if pipelines.pipelines is not None
            else []
        )

    def create_pipeline(self, pipeline: CreatePipeline) -> None:
        tmp_path: str = f"/tmp/pipeline_{pipeline.name}.yaml"
        urlretrieve(pipeline.config_url, tmp_path)
        self.client.upload_pipeline(
            pipeline_package_path=tmp_path, pipeline_name=pipeline.name, description=pipeline.description
        )

    def get_all_runs(self) -> List[Run]:
        runs: ApiListRunsResponse = self.client.list_runs(namespace=self.usernamespace)
        return (
            [
                Run(
                    id=run.id,
                    name=run.name,
                    description=run.description,
                    status=run.status,
                    error=run.error,
                    metrics=run.metrics,
                )
                for run in runs.runs
            ]
            if runs.runs is not None
            else []
        )

    def create_run(self, experiment_id: str, pipeline_id: str, run: CreateRun) -> str:
        run: ApiRun = self.client.run_pipeline(
            experiment_id=experiment_id, job_name=run.name, pipeline_id=pipeline_id, params=run.params
        )
        return run.id

    def get_run(self, run_id: str) -> Run:
        run: ApiRun = self.client.runs.get_run(run_id).run
        return Run(
            id=run.id,
            name=run.name,
            description=run.description,
            status=run.status,
            error=run.error,
            metrics=run.metrics,
        )
