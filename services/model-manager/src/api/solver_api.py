from fastapi import (
    APIRouter,
    Depends,
)

from models.solver import Solver
from services.solver_service import SolverService

router = APIRouter(prefix="/apis/v1beta1/modelmanager")


@router.get(
    "/solvers",
    responses={
        200: {"model": list[Solver], "description": "OK"},
    },
    tags=["modelmanager", "solver"],
    summary="get all solvers",
)
async def get_all_pipeline_templates(
        service=Depends(SolverService)
) -> list[Solver]:
    return service.list_solvers()
