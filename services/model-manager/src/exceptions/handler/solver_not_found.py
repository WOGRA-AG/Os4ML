from http import HTTPStatus

from starlette.requests import Request
from starlette.responses import JSONResponse

from build.openapi_server.main import app
from exceptions import SolverNotFoundException


@app.exception_handler(SolverNotFoundException)  # type: ignore
async def solver_not_found_exception_handler(
    request: Request, exc: SolverNotFoundException
) -> JSONResponse:
    return JSONResponse(
        status_code=HTTPStatus.NOT_FOUND, content={"message": exc.message}
    )