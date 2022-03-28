from typing import Optional

from fastapi_utils.api_model import APIModel


class SolutionMetrics(APIModel):
    accuracy: Optional[float] = None
    runtime: Optional[str] = None
    precision: Optional[str] = None
