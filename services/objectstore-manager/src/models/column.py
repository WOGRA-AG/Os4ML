from typing import Optional

from fastapi_utils.api_model import APIModel


class Column(APIModel):
    name: Optional[str] = None
    type: Optional[str] = None
    usage: Optional[str] = None
    num_entries: Optional[int] = None
