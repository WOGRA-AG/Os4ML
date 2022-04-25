# coding: utf-8
import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from api.routers.experiment_router import router as experiment_router
from api.routers.pipeline_router import router as pipeline_router
from api.routers.run_router import router as run_router
from api.routers.solution_router import router as solution_router
from api.routers.template_router import router as template_router

app = FastAPI(title="Job Manager", description="Job Manager", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(experiment_router)
app.include_router(pipeline_router)
app.include_router(run_router)
app.include_router(template_router)
app.include_router(solution_router)

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000, log_level="debug")
