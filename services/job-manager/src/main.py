# coding: utf-8
import uvicorn
from fastapi import FastAPI

from api.routers.artifact_router import router as ArtifactApiRouter
from api.routers.experiment_router import router as ExperimentApiRouter
from api.routers.pipeline_router import router as PipelineApiRouter
from api.routers.run_router import router as RunApiRouter

app = FastAPI(title="Job Manager", description="Job Manager", version="1.0.0")

app.include_router(ArtifactApiRouter)
app.include_router(ExperimentApiRouter)
app.include_router(PipelineApiRouter)
app.include_router(RunApiRouter)

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000, log_level="debug")
