from http import HTTPStatus

from starlette.requests import Request
from starlette.responses import JSONResponse

from build.openapi_server.main import app
from exceptions import IdUpdateNotAllowedException


@app.exception_handler(IdUpdateNotAllowedException)  # type: ignore
async def id_update_not_allowed_exception_handler(
    request: Request, exc: IdUpdateNotAllowedException
) -> JSONResponse:
    return JSONResponse(
        status_code=HTTPStatus.BAD_REQUEST, content={"message": exc.message}
    )
