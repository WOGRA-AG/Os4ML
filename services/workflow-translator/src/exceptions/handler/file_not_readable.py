from http import HTTPStatus

from starlette.requests import Request
from starlette.responses import JSONResponse

from src.build.openapi_server.main import app
from src.exceptions import FileNotReadableException


@app.exception_handler(FileNotReadableException)
async def file_not_readable_exception_handler(
    request: Request, exc: FileNotReadableException
):
    return JSONResponse(
        status_code=HTTPStatus.FORBIDDEN,
        content={"message": exc.message},
    )
