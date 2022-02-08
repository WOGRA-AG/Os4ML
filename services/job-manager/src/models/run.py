from pydantic import BaseModel


class Run(BaseModel):
    id: int
    name: str
    description: str
