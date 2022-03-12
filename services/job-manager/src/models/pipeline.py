from typing import Optional

from fastapi_utils.api_model import APIModel


class Pipeline(APIModel):
    id: Optional[str] = None
    name: str
    description: str
