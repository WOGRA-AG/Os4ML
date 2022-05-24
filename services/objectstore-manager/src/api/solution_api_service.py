from typing import List

from build.openapi_server.models.solution import Solution
from services.solution_service import SolutionService


class SolutionApiService:
    def __init__(self, solution_service=None):
        self.solution_service: SolutionService = (solution_service if solution_service is not None else SolutionService())

    def get_all_solutions(self) -> List[Solution]:
        return self.solution_service.get_all_solutions()
