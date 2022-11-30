# coding: utf-8
import uvicorn
from fastapi.middleware.cors import CORSMiddleware

import exceptions.handler  # Needed to initialize exception handlers
from build.openapi_server.main import app
from repository.clients.init_clients import init_clients

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# initialize clients at startup
app.on_event("startup")(init_clients)

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8001, log_level="debug")
