from build.openapi_server.models.solution import Solution
from services.solution_service import SolutionService


class SolutionApiService:
    def __init__(self, solution_service=None):
        self.solution_service: SolutionService = solution_service

    def post_solution(self, solution: Solution) -> str:
        return self.solution_service.create_solution(solution)
