# coding: utf-8
import uvicorn
from fastapi.middleware.cors import CORSMiddleware

import src.exceptions.handler  # Needed to initialize exception handlers
from src.build.openapi_server.main import app

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8002, log_level="debug")
