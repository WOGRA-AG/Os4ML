from kfp import Client

from build.openapi_server.models.experiment import Experiment
from build.openapi_server.models.run import Run
from services import ML_PIPELINE_NS, ML_PIPELINE_URL


class KfpExecutor:
    def __init__(
            self,
            host: str = ML_PIPELINE_URL,
            namespace: str = ML_PIPELINE_NS,
            client=None,
    ):
        self.client = client if client is not None else Client(host, namespace)
        self.usernamespace = self.client.get_user_namespace()

    def create_experiment(self, experiment: Experiment) -> str:
        experiment = self.client.create_experiment(
            experiment.name,
            experiment.description,
            namespace=self.usernamespace,
        )
        return experiment.id

    def create_run(
            self, name: str, experiment_id: str, pipeline_path: str, run_params: dict[str, str]
    ) -> str:
        run = self.client.run_pipeline(
            job_name=name,
            experiment_id=experiment_id,
            pipeline_package_path=pipeline_path,
            params=run_params,
        )
        return run.id

    def get_run(self, run_id: str) -> Run:
        run = self.client.get_run(run_id).run
        return Run(
            id=run.id,
            name=run.name,
            status=run.status,
            error=run.error,
            metrics=run.metrics,
        )

    def terminate_run(self, run_id) -> None:
        self.client.runs.terminate_run(run_id)
