from http import HTTPStatus

from build.openapi_server.main import app
from starlette.requests import Request
from starlette.responses import JSONResponse

from exceptions import ResourceNotFoundException


@app.exception_handler(ResourceNotFoundException)  # type: ignore
async def resource_not_found_exception_handler(
    request: Request, exc: ResourceNotFoundException
) -> JSONResponse:
    return JSONResponse(
        status_code=HTTPStatus.NOT_FOUND, content={"message": exc.message}
    )
