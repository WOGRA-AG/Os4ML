from pydantic import BaseModel


class Experiment(BaseModel):
    id: int
    name: str
    description: str
