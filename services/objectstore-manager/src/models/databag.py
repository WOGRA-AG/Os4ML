from typing import List, Optional

from fastapi_utils.api_model import APIModel
from openapi_server.models.column import Column


class Databag(APIModel):
    dataset_type: Optional[str] = None
    file_name: Optional[str] = None
    databag_name: Optional[str] = None
    bucket_name: Optional[str] = None
    number_rows: Optional[int] = None
    number_columns: Optional[int] = None
    creation_time: Optional[str] = None
    columns: Optional[List[Column]] = None
