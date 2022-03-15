from typing import Optional

from fastapi_utils.api_model import APIModel

from .run_params import RunParams


class CreateRun(APIModel):
    name: Optional[str] = None
    description: Optional[str] = None
    params: Optional[RunParams] = None
