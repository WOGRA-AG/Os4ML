from typing import Optional

from fastapi_utils.api_model import APIModel


class Url(APIModel):
    url: Optional[str] = None
