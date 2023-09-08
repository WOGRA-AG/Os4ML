from build.model_manager_client.model.databag import Databag
from file_type.file_type import (
    file_type_from_file_name,
    get_file_name_from_url,
)
from models.databag_type import DatabagType
from models.file_type import FileType


def get_dataset_file_type(databag: Databag) -> FileType:
    file_name = databag.dataset_file_name
    if databag.databag_type == DatabagType.FILE_URL:
        file_name = get_file_name_from_url(databag.dataset_url)
    return file_type_from_file_name(file_name)
