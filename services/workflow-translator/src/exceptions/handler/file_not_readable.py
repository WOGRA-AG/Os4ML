from http import HTTPStatus

from starlette.requests import Request
from starlette.responses import JSONResponse

from exceptions import FileNotReadableException
from main import app


@app.exception_handler(FileNotReadableException)
async def file_not_readable_exception_handler(
    request: Request, exc: FileNotReadableException
):
    return JSONResponse(
        status_code=HTTPStatus.FORBIDDEN,
        content={"message": exc.message},
    )
