from typing import List

from fastapi import APIRouter, Depends

from src.models import Bucket
from src.services import MinioService

router = APIRouter(prefix="/apis/v1beta1")


@router.get(
    "/objectstore",
    responses={200: {"model": List[Bucket], "description": "Successful response"}},
    tags=["objectstore"],
    summary="get all buckets",
    response_model=List[Bucket],
)
async def get_all_buckets(minio_service: MinioService = Depends(MinioService)) -> List[Bucket]:
    return minio_service.get_buckets()
