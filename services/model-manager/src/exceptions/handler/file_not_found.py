from http import HTTPStatus

from starlette.requests import Request
from starlette.responses import JSONResponse

from src.build.openapi_server.main import app
from src.exceptions import FileNotFoundException


@app.exception_handler(FileNotFoundException)  # type: ignore
async def file_not_found_exception_handler(
    request: Request, exc: FileNotFoundException
) -> JSONResponse:
    return JSONResponse(
        status_code=HTTPStatus.NOT_FOUND, content={"message": exc.message}
    )
