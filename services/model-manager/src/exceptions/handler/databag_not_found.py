from http import HTTPStatus

from starlette.requests import Request
from starlette.responses import JSONResponse

from exceptions import DatabagNotFoundException
from main import app


@app.exception_handler(DatabagNotFoundException)  # type: ignore
async def template_not_found_exception_handler(
    request: Request, exc: DatabagNotFoundException
) -> JSONResponse:
    return JSONResponse(
        status_code=HTTPStatus.NOT_FOUND, content={"message": exc.message}
    )
