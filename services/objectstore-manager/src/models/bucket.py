from pydantic import BaseModel


class Bucket(BaseModel):
    name: str
