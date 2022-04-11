import json
from uuid import UUID, uuid4

from build.openapi_client.api.objectstore_api import ObjectstoreApi
from build.openapi_client.model.databag import Databag

from build.openapi_server.models.solution import Solution
from build.openapi_server.models.run_params import RunParams

from services import SOLUTION_CONFIG_FILE_NAME
from services.template_service import TemplateService


class SolutionService:
    def __init__(self, kfp_client=None):
        self.template_service = TemplateService(kfp_client=kfp_client)
        self.objectstore = ObjectstoreApi()

    def create_solution(self, solution: Solution) -> str:
        uuid: UUID = uuid4()
        solution.name = f"{uuid}_{solution.name}"
        file_name: str = f"{solution.name}/{SOLUTION_CONFIG_FILE_NAME}"
        databag: Databag = self.objectstore.get_databag_by_bucket_name(solution.bucket_name)
        run_params: RunParams = RunParams(bucket=databag.bucket_name, file_name=databag.file_name)
        self._persist_solution(solution, file_name)
        run_id: str = self.template_service.run_pipeline_template(solution.solver, run_params)
        solution.run_id = run_id
        self._persist_solution(solution, file_name)
        return run_id

    def _persist_solution(self, solution: Solution, file_name: str):
        with open(f"/tmp/{SOLUTION_CONFIG_FILE_NAME}", "w") as file:
            json.dump(solution.dict(), file)
        with open(f"/tmp/{SOLUTION_CONFIG_FILE_NAME}", "r") as file:
            self.objectstore.put_object_by_name(bucket_name=solution.bucket_name, object_name=f"{file_name}", body=file)
