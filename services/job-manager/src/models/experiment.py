from typing import Optional

from fastapi_utils.api_model import APIModel


class Experiment(APIModel):
    id: Optional[str] = None
    name: str
    description: Optional[str] = None
