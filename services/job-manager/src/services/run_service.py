import tempfile
import uuid

import yaml
from fastapi import Depends

from build.openapi_server.models.experiment import Experiment
from build.openapi_server.models.run import Run
from build.openapi_server.models.run_params import RunParams
from build.translator_client.api.workflowtranslator_api import (
    WorkflowtranslatorApi,
)
from executor.kfp_executor import KfpExecutor
from services import OS4ML_NAMESPACE


class RunService:
    def __init__(
        self,
        kfp_executor: KfpExecutor = Depends(),
        workflowtranslator: WorkflowtranslatorApi = Depends(),
    ):
        self.kfp_executor = kfp_executor
        self.workflowtranslator = workflowtranslator

    def get_run_by_id(self, run_id: str) -> Run:
        return self.kfp_executor.get_run(run_id)

    def terminate_run_by_id(self, run_id: str) -> None:
        return self.kfp_executor.terminate_run(run_id)

    def create_run_by_solver_name(
        self, solver_name: str, run_params: RunParams, usertoken: str
    ) -> str:
        name = f"{uuid.uuid4()}_{solver_name}"

        experiment = Experiment(name=name)
        experiment_id = self.kfp_executor.create_experiment(experiment)

        pipeline_dict: dict[
            str, object
        ] = self.workflowtranslator.get_pipeline_template_by_name(
            solver_name, usertoken=usertoken
        )
        with tempfile.NamedTemporaryFile(suffix=".yaml") as pipeline_tmp_file:
            with open(pipeline_tmp_file.name, "w") as pipeline_file:
                yaml.safe_dump(pipeline_dict, pipeline_file)
            return self.kfp_executor.create_run(
                name, experiment_id, pipeline_tmp_file.name, run_params.dict()
            )
