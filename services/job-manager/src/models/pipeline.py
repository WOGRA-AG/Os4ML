from pydantic import BaseModel


class Pipeline(BaseModel):
    id: int
    name: str
    description: str
