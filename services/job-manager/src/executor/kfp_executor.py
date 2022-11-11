from fastapi import Depends
from kfp import Client
from kfp_server_api import ApiException

from build.openapi_server.models.experiment import Experiment
from build.openapi_server.models.run import Run
from exceptions import RunNotFoundException
from services import ML_PIPELINE_NS, ML_PIPELINE_URL


def init_kfp_client() -> Client:
    return Client(ML_PIPELINE_URL, ML_PIPELINE_NS)


class KfpExecutor:
    def __init__(self, client: Client = Depends(init_kfp_client)):
        self.client = client
        self.usernamespace = self.client.get_user_namespace()

    def create_experiment(self, experiment: Experiment) -> str:
        experiment = self.client.create_experiment(
            experiment.name,
            experiment.description,
            namespace=self.usernamespace,
        )
        return experiment.id

    def create_run(
        self,
        name: str,
        experiment_id: str,
        pipeline_path: str,
        run_params: dict[str, str],
    ) -> str:
        run = self.client.run_pipeline(
            job_name=name,
            experiment_id=experiment_id,
            pipeline_package_path=pipeline_path,
            params=run_params,
        )
        return run.id

    def get_run(self, run_id: str) -> Run:
        try:
            run = self.client.get_run(run_id).run
        except ApiException:
            raise RunNotFoundException(run_id)
        return Run(
            id=run.id,
            name=run.name,
            status=run.status,
            error=run.error,
            metrics=run.metrics,
        )

    def terminate_run(self, run_id) -> None:
        self.client.runs.terminate_run(run_id)
