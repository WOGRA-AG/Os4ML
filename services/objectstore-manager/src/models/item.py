from fastapi_utils.api_model import APIModel


class Item(APIModel):
    bucket_name: str
    object_name: str
