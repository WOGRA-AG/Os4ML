from typing import List

from fastapi import APIRouter, Body, Depends, Path

from src.models import Databag
from src.services import MinioService

router = APIRouter(prefix="/apis/v1beta1")


@router.get(
    "/objectstore/databag",
    responses={
        200: {"model": List[Databag], "description": "Successful response"}
    },
    tags=["objectstore", "databag"],
    summary="get all databags",
)
async def get_all_databags(
    minio_service: MinioService = Depends(MinioService),
) -> List[Databag]:
    return minio_service.get_databags()


@router.get(
    "/objectstore/databag/{bucket_name}",
    responses={200: {"model": Databag, "description": "Successful response"}},
    tags=["objectstore", "databag"],
    summary="get databag by bucket name",
)
async def get_databag_by_bucket_name(
    bucket_name: str = Path(..., description="Name of Bucket"),
    minio_service: MinioService = Depends(MinioService),
) -> Databag:
    return minio_service.get_databag_by_bucket_name(bucket_name)


@router.put(
    "/objectstore/databag/{bucket_name}",
    responses={201: {"description": "New resource created"}},
    tags=["objectstore", "databag"],
    summary="update databag",
)
async def put_databag_by_bucket_name(
    bucket_name: str = Path(..., description="Name of Bucket"),
    databag: Databag = Body(..., description=""),
    minio_service: MinioService = Depends(MinioService),
) -> None:
    return minio_service.put_databag_by_bucket_name(bucket_name, databag)
