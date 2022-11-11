from http import HTTPStatus

from starlette.requests import Request
from starlette.responses import JSONResponse

from exceptions import SolverNotFoundException
from main import app


@app.exception_handler(SolverNotFoundException)  # type: ignore
async def template_not_found_exception_handler(
    request: Request, exc: SolverNotFoundException
) -> JSONResponse:
    return JSONResponse(
        status_code=HTTPStatus.NOT_FOUND, content={"message": exc.message}
    )
