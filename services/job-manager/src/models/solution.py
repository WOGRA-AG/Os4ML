from typing import List, Optional

from fastapi_utils.api_model import APIModel
from .solution_metrics import SolutionMetrics


class Solution(APIModel):
    name: Optional[str] = None
    solver: Optional[str] = None
    databag_name: Optional[str] = None
    bucket_name: Optional[str] = None
    input_fields: Optional[List[str]] = None
    output_fields: Optional[List[str]] = None
    run_id: Optional[str] = None
    status: Optional[str] = None
    creation_time: Optional[str] = None
    completion_time: Optional[str] = None
    metrics: Optional[SolutionMetrics] = None
