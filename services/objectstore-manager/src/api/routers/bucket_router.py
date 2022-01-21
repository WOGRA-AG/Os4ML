from fastapi import APIRouter, Depends, Path

from src.models import Bucket, Message
from src.services import MinioServiceInterface

router = APIRouter(prefix="/apis/v1beta1")


@router.delete(
    "/objectstore/{bucket_name}",
    responses={
        204: {"description": "The specified resource was deleted"},
        404: {"model": Message, "description": "The specified resource was not found"},
    },
    tags=["objectstore", "bucket"],
    summary="delete bucket",
)
async def delete_bucket(
    bucket_name: str = Path(..., description="Name of Bucket"),
    minio_service: MinioServiceInterface = Depends(MinioServiceInterface),
) -> None:
    minio_service.delete_bucket(bucket_name=bucket_name)


@router.post(
    "/objectstore/{bucket_name}",
    responses={
        201: {"model": Bucket, "description": "New resource created"},
        400: {"model": str, "description": "Invalid Request"},
    },
    tags=["objectstore", "bucket"],
    summary="create new bucket",
    response_model=Bucket,
)
async def post_new_bucket(
    bucket_name: str = Path(..., description="Name of Bucket"),
    minio_service: MinioServiceInterface = Depends(MinioServiceInterface),
) -> Bucket:
    return minio_service.create_bucket(bucket_name)
