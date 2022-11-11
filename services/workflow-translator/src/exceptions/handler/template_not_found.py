from http import HTTPStatus

from starlette.requests import Request
from starlette.responses import JSONResponse

from exceptions import TemplateNotFoundException
from main import app


@app.exception_handler(TemplateNotFoundException)
async def template_not_found_exception_handler(
    request: Request, exc: TemplateNotFoundException
):
    return JSONResponse(
        status_code=HTTPStatus.NOT_FOUND, content={"message": exc.message}
    )
