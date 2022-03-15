from fastapi import APIRouter, Body, Depends

from models import Solution
from services.solution_service import SolutionService

router = APIRouter(prefix="/apis/v1beta1")


@router.post("/jobmanager/solution",
             responses={201: {"description": "New solution created"}},
             tags=["jobmanager", "solution"],
             summary="Create Solution",)
async def post_solution(
        solution: Solution = Body(..., description="Solution to create"),
        solution_service: SolutionService = Depends(SolutionService)
) -> str:
    return solution_service.create_solution(solution)
