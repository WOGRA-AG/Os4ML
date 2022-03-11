import uvicorn
from fastapi import FastAPI

from src.api.routers import bucket_router, object_router, objectstore_router

VERSION: str = "1.0"

app = FastAPI(title="os4ml-objectstore-manager", version=VERSION)

app.include_router(bucket_router)
app.include_router(object_router)
app.include_router(objectstore_router)

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8001, log_level="debug")
