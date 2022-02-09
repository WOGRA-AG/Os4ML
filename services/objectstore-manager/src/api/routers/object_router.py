from io import BytesIO
from typing import List

from fastapi import APIRouter, Depends, Path
from fastapi.responses import RedirectResponse
from starlette.requests import Request

from src.models import Item, Message, Url
from src.services import MinioServiceInterface

router = APIRouter(prefix="/apis/v1beta1")


@router.get(
    "/objectstore/{bucket_name}/object",
    responses={
        200: {"model": List[Item], "description": "OK"},
        404: {"model": Message, "description": "The specified resource was not found"},
    },
    tags=["objectstore", "object"],
    summary="get all Objects in bucket",
    response_model=List[Item],
)
async def get_all_objects(
    bucket_name: str = Path(..., description="Name of Bucket"),
    minio_service: MinioServiceInterface = Depends(MinioServiceInterface),
) -> List[Item]:
    return minio_service.list_objects(bucket_name)


@router.delete(
    "/objectstore/{bucket_name}/object/{object_name}",
    responses={
        204: {"description": "The specified resource was deleted"},
        404: {"model": Message, "description": "The specified resource was not found"},
    },
    tags=["objectstore", "object"],
    summary="delete specific Object from Bucket",
)
async def delete_object_by_name(
    bucket_name: str = Path(..., description="Name of Bucket"),
    object_name: str = Path(..., description="Name of Object"),
    minio_service: MinioServiceInterface = Depends(MinioServiceInterface),
) -> None:
    minio_service.delete_object(bucket_name, object_name)


@router.get(
    "/objectstore/{bucket_name}/object/{object_name}",
    responses={
        307: {"model": str, "description": "OK"},
        404: {"model": Message, "description": "The specified resource was not found"},
    },
    tags=["objectstore", "object"],
    summary="get specific Object from Bucket",
    response_class=RedirectResponse,
)
async def get_object_by_name(
    bucket_name: str = Path(..., description="Name of Bucket"),
    object_name: str = Path(..., description="Name of Object"),
    minio_service: MinioServiceInterface = Depends(MinioServiceInterface),
) -> str:
    return minio_service.get_presigned_get_url(bucket_name, object_name)


@router.put(
    "/objectstore/{bucket_name}/object/{object_name}",
    responses={
        201: {"description": "Created"},
        404: {"model": Message, "description": "The specified resource was not found"},
    },
    tags=["objectstore", "object"],
    summary="get specific Object from Bucket",
)
async def put_object_by_name(
    request: Request,
    bucket_name: str = Path(..., description="Name of Bucket"),
    object_name: str = Path(..., description="Name of Object"),
    minio_service: MinioServiceInterface = Depends(MinioServiceInterface),
) -> None:
    file_content: bytes = await request.body()
    file: BytesIO = BytesIO(file_content)
    return minio_service.put_object(bucket_name, object_name, file, len(file_content), "application/octet-stream")


@router.get(
    "/objectstore/{bucket_name}/object/{object_name}/presignedurl",
    responses={
        200: {"model": Url, "description": "OK"},
        404: {"model": Message, "description": "The specified resource was not found"},
    },
    tags=["objectstore", "object"],
    summary="upload Object to Bucket",
    response_model=Url,
)
async def get_presigned_put_url(
    bucket_name: str = Path(..., description="Name of Bucket"),
    object_name: str = Path(..., description="Name of Object"),
    minio_service: MinioServiceInterface = Depends(MinioServiceInterface),
) -> Url:
    return minio_service.get_presigned_put_url(bucket_name, object_name)