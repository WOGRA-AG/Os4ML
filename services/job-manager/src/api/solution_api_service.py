from build.openapi_server.models.solution import Solution
from services.solution_service import SolutionService


class SolutionApiService:
    def __init__(self, solution_service=None):
        self.solution_service = (
            solution_service
            if solution_service is not None
            else SolutionService()
        )

    def post_solution(self, solution: Solution) -> str:
        return self.solution_service.create_solution(solution)

    def get_solution(self, solution_name: str) -> Solution:
        return self.solution_service.get_solution(solution_name)

    def put_solution(self, solution_name: str, solution: Solution):
        return self.solution_service.put_solution(solution_name, solution)
