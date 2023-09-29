from http import HTTPStatus

from starlette.requests import Request
from starlette.responses import JSONResponse

from src.build.openapi_server.main import app
from src.exceptions import FileNameNotSpecifiedException


@app.exception_handler(FileNameNotSpecifiedException)  # type: ignore
async def file_name_not_specified_exception_handler(
    request: Request, exc: FileNameNotSpecifiedException
) -> JSONResponse:
    return JSONResponse(
        status_code=HTTPStatus.BAD_REQUEST, content={"message": exc.message}
    )
