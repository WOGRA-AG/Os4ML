from typing import List, Optional

from fastapi_utils.api_model import APIModel
from .metrics import Metrics


class Run(APIModel):
    id: Optional[str] = None
    name: str
    description: Optional[str] = None
    status: Optional[str] = None
    error: Optional[str] = None
    metrics: Optional[List[Metrics]] = None
