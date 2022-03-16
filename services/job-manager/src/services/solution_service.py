import json
from uuid import uuid4

from openapi_client.api.objectstore_api import ObjectstoreApi
from openapi_client.model.databag import Databag

from models import RunParams, Solution
from src import SOLUTION_CONFIG_FILE_NAME

from .template_service import TemplateService


class SolutionService:
    def __init__(self, kfp_client=None):
        self.template_service = TemplateService(kfp_client=kfp_client)
        self.objectstore = ObjectstoreApi()

    def create_solution(self, solution: Solution) -> str:
        file_name: str = f"solution_{uuid4()}/{SOLUTION_CONFIG_FILE_NAME}"
        databag: Databag = self.objectstore.get_databag_by_bucket_name(solution.bucket_name)
        run_params: RunParams = RunParams(bucket=databag.bucket_name, file_name=databag.file_name)
        with open(f"/tmp/{SOLUTION_CONFIG_FILE_NAME}", "w") as file:
            json.dump(solution.dict(), file)
        with open(f"/tmp/{SOLUTION_CONFIG_FILE_NAME}", "r") as file:
            self.objectstore.put_object_by_name(bucket_name=solution.bucket_name, object_name=f"{file_name}", body=file)
        run_id: str = self.template_service.run_pipeline_template(solution.solver, run_params)
        return run_id
