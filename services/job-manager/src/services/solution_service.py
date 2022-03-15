import json
from uuid import uuid4
from models import Solution
from openapi_client.api.objectstore_api import ObjectstoreApi
from .kfp_service import KfpService
from .template_service import TemplateService


class SolutionService:
    def __init__(self, kfp_client=None):
        self.kfp_service = KfpService(client=kfp_client)
        self.objectstore = ObjectstoreApi()

    def create_solution(self, solution: Solution) -> str:
        # post in Objectstore
        # get Solver PipelineTemplate
        # run pipeline
        # ---------------------------------
        # post in Objectstore
        # use template_service to run solver Pipeline
        return ''
