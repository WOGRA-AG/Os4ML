from http import HTTPStatus

from starlette.requests import Request
from starlette.responses import JSONResponse

from main import app
from exceptions import BucketNotFoundException


@app.exception_handler(BucketNotFoundException)
async def template_not_found_exception_handler(
    request: Request, exc: BucketNotFoundException
):
    return JSONResponse(
        status_code=HTTPStatus.NOT_FOUND, content={"message": exc.message}
    )
