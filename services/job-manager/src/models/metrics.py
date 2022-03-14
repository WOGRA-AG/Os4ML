from typing import Optional

from fastapi_utils.api_model import APIModel


class Metrics(APIModel):
    name: Optional[str] = None
    value: Optional[float] = None
    format: Optional[str] = None
