from __future__ import annotations

from typing import Optional

from fastapi_utils.api_model import APIModel


class RunParams(APIModel):
    bucket: Optional[str] = None
    file_name: Optional[str] = None
