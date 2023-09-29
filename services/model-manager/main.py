import uvicorn
from fastapi.middleware.cors import CORSMiddleware

import src.exceptions.handler  # Needed to initialize exception handlers
from src.api.router.websocket_router import router as ws_router
from src.build.openapi_server.main import app
from src.services.messaging_service import MessagingService

app.include_router(ws_router)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.on_event("shutdown")(MessagingService.terminate_threads)


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8003, log_level="debug")
