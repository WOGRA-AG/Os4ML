from typing import List, Optional

from fastapi_utils.api_model import APIModel
from openapi_server.models.solution_metrics import SolutionMetrics


class Solution(APIModel):
    name: Optional[str] = None
    solver: Optional[str] = None
    databagName: Optional[str] = None
    bucketName: Optional[str] = None
    input_fields: Optional[List[str]] = None
    output_fields: Optional[List[str]] = None
    run_id: Optional[str] = None
    metrics: Optional[SolutionMetrics] = None
