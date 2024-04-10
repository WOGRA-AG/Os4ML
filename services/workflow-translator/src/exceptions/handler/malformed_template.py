from http import HTTPStatus

from starlette.requests import Request
from starlette.responses import JSONResponse

from src.build.openapi_server.main import app
from src.exceptions import MalformedTemplateException


@app.exception_handler(MalformedTemplateException)
async def malformed_template_exception_handler(
    request: Request, exc: MalformedTemplateException
):
    return JSONResponse(
        status_code=HTTPStatus.BAD_REQUEST,
        content={"message": exc.message},
    )
