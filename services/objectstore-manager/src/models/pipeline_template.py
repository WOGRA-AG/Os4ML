from typing import Optional

from pydantic import BaseModel


class PipelineTemplate(BaseModel):
    name: Optional[str] = None
    type: Optional[str] = None
    description: Optional[str] = None
    pipeline_step: Optional[str] = None
    file_url: Optional[str] = None
