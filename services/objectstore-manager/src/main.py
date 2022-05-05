import uvicorn
from fastapi import FastAPI

from src.api.routers import (
    bucket_router,
    databag_router,
    object_router,
    objectstore_router,
    template_router,
)
from src.api.routers.solution_router import router as solution_router

VERSION: str = "1.0"

app = FastAPI(title="os4ml-objectstore-manager", version=VERSION)

app.include_router(bucket_router)
app.include_router(object_router)
app.include_router(objectstore_router)
app.include_router(databag_router)
app.include_router(template_router)
app.include_router(solution_router)

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8001, log_level="debug")
