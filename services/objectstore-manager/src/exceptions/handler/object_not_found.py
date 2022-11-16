from http import HTTPStatus

from starlette.requests import Request
from starlette.responses import JSONResponse

from build.openapi_server.main import app
from exceptions import ObjectNotFoundException


@app.exception_handler(ObjectNotFoundException)
async def object_not_found_exception_handler(
    request: Request, exc: ObjectNotFoundException
):
    return JSONResponse(
        status_code=HTTPStatus.NOT_FOUND, content={"message": exc.message}
    )
