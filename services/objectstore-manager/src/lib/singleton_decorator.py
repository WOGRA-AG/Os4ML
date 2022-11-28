import contextlib
from typing import Any, AsyncGenerator, Callable

import fastapi


# see https://github.com/tiangolo/fastapi/issues/504#issuecomment-585880851
def singleton(app: fastapi.FastAPI) -> Any:
    def decorator(func: Callable[[], AsyncGenerator[Any, None]]) -> Any:
        cm_factory = contextlib.asynccontextmanager(func)
        stack = contextlib.AsyncExitStack()
        sentinel_start = object()
        sentinel_shutdown = object()
        value: Any = sentinel_start

        @app.on_event("startup")
        async def _startup() -> None:
            nonlocal value
            value = await stack.enter_async_context(cm_factory())

        @app.on_event("shutdown")
        async def _shutdown() -> None:
            nonlocal value
            await stack.pop_all().aclose()
            value = sentinel_shutdown

        def get_value() -> Any:
            if value is sentinel_start:
                raise RuntimeError("Application not started yet.")
            if value is sentinel_shutdown:
                raise RuntimeError("Application already shut down.")
            return value

        return fastapi.Depends(get_value)

    return decorator
