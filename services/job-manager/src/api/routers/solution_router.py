from fastapi import APIRouter, Body, Depends, Path

from models import Solution
from services.solution_service import SolutionService

router = APIRouter(prefix="/apis/v1beta1")


@router.get(
    "/jobmanager/solution/{solution_name}",
    responses={200: {"description": "Solution found"}},
    tags=['jobmanager, "solution'],
    summary="Get a Sollution",
)
async def get_solution(
    solution_name: str = Path(..., description="Name of the solution"),
    solution_service: SolutionService = Depends(SolutionService),
) -> Solution:
    return solution_service.get_solution(solution_name)


@router.put(
    "/jobmanager/solution/{solution_name}",
    responses={200: {"description": "Solution Updated"}},
    tags=["jobmanager", "solution"],
    summary="Update a Solution",
)
async def put_solution(
    solution_name: str = Path(
        ..., description="Name of the solution to update"
    ),
    solution: Solution = Body(..., description="Solution with updates"),
    solution_service: SolutionService = Depends(SolutionService),
) -> Solution:
    return solution_service.update_solution(solution_name, solution)


@router.post(
    "/jobmanager/solution",
    responses={201: {"description": "New solution created"}},
    tags=["jobmanager", "solution"],
    summary="Create Solution",
)
async def post_solution(
    solution: Solution = Body(..., description="Solution to create"),
    solution_service: SolutionService = Depends(SolutionService),
) -> str:
    return solution_service.create_solution(solution)
