from http import HTTPStatus

from starlette.requests import Request
from starlette.responses import JSONResponse

from build.openapi_server.main import app
from exceptions import RunNotFoundException


@app.exception_handler(RunNotFoundException)  # type: ignore
async def run_not_found_exception_handler(
    request: Request, exc: RunNotFoundException
) -> JSONResponse:
    return JSONResponse(
        status_code=HTTPStatus.NOT_FOUND, content={"message": exc.message}
    )
