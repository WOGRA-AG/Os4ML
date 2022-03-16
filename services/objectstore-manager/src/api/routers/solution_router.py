from typing import List
from fastapi import APIRouter, Depends
from openapi_server.models.solution import Solution
from services import SolutionService

router = APIRouter(prefix="/apis/v1beta1")


@router.get(
    "/objectstore/solution",
    responses={
        200: {"model": List[Solution], "description": "OK"},
    },
    tags=["objectstore", "solution"],
    summary="get all solutions",
)
async def get_all_solutions(
        solution_service: SolutionService = Depends(SolutionService)
) -> List[Solution]:
    return solution_service.get_all_solutions()
