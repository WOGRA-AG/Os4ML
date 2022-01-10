from pydantic import BaseModel


class Item(BaseModel):
    bucket_name: str
    object_name: str
