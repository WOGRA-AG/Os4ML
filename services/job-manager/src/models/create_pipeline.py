from typing import Optional

from fastapi_utils.api_model import APIModel


class CreatePipeline(APIModel):
    id: Optional[str] = None
    name: str
    description: str
    config_url: Optional[str] = None
