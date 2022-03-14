from typing import Any, Dict, Optional

from fastapi_utils.api_model import APIModel


class CreateRun(APIModel):
    name: Optional[str] = None
    description: Optional[str] = None
    params: Optional[Dict[str, Any]] = None
