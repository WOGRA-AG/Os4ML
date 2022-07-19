from typing import List

from build.openapi_server.models.solution import Solution
from services import STORAGE_BACKEND
from services.init_storage_service import storage_services
from services.solution_service import SolutionService


class SolutionApiService:
    def __init__(self, storage_service=None):
        self.solution_service: SolutionService = (
            SolutionService(storage_service)
            if storage_service is not None
            else SolutionService(storage_services[STORAGE_BACKEND]())
        )

    def get_all_solutions(self) -> List[Solution]:
        return self.solution_service.get_all_solutions()
