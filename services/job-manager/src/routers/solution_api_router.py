from build.openapi_server.models.solution import Solution
from services.solution_service import SolutionService


class SolutionApiRouter:
    @staticmethod
    def post_solution(solution: Solution) -> str:
        return SolutionService().create_solution(solution)
