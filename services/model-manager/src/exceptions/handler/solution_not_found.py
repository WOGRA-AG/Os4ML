from http import HTTPStatus

from starlette.requests import Request
from starlette.responses import JSONResponse

from build.openapi_server.main import app
from exceptions import SolutionNotFoundException


@app.exception_handler(SolutionNotFoundException)  # type: ignore
async def solution_not_found_exception_handler(
    request: Request, exc: SolutionNotFoundException
) -> JSONResponse:
    return JSONResponse(
        status_code=HTTPStatus.NOT_FOUND, content={"message": exc.message}
    )
