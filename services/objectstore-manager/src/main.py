# coding: utf-8
import uvicorn
from fastapi.middleware.cors import CORSMiddleware

from build.openapi_server.main import app
from repository import StorageRepository
from repository.init_storage_service import storage_services
from services import STORAGE_BACKEND, BUCKET_NAME

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
async def init_bucket():
    storage_service: StorageRepository = storage_services[STORAGE_BACKEND]()
    storage_service.create_bucket(BUCKET_NAME)


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8001, log_level="debug")
