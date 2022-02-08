from pydantic import BaseModel


class Artifact(BaseModel):
    id: int
    name: str
    description: str
