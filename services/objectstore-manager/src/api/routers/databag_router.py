from typing import List
from fastapi import APIRouter, Depends
from src.models import Bucket
from src.services import MinioService

router = APIRouter()


@router.get(
    "/apis/v1beta1/objectstore/databag",
    responses={
        200: {"model": List[Bucket], "description": "Successful response"},
    },
    tags=["objectstore", "databag"],
    summary="get all databags",
)
async def get_all_databags(minio_service: MinioService = Depends(MinioService)) -> List[Bucket]:
    return minio_service.get_databags()
