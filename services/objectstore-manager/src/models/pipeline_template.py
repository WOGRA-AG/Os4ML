from typing import Optional

from fastapi_utils.api_model import APIModel


class PipelineTemplate(APIModel):
    name: Optional[str] = None
    type: Optional[str] = None
    description: Optional[str] = None
    pipeline_step: Optional[str] = None
    file_url: Optional[str] = None
