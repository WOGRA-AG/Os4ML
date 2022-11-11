import uvicorn
from fastapi.middleware.cors import CORSMiddleware

import exceptions.handler  # Needed to initialize exception handlers
from build.openapi_server.main import app

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8003, log_level="debug")
