from __future__ import annotations

import enum
import pathlib

from src.util.uri import is_shepard_uri, is_uri


class DatabagType(str, enum.Enum):
    local_file = "local_file"
    zip_file = "zip_file"
    file_url = "file_url"
    shepard_url = "shepard_url"

    @classmethod
    def from_uri(cls, uri: str) -> DatabagType:
        if is_shepard_uri(uri):
            return DatabagType.shepard_url
        elif is_uri(uri):
            return DatabagType.file_url
        else:
            suffix = pathlib.Path(uri).suffix
            return (
                DatabagType.zip_file
                if suffix == ".zip"
                else DatabagType.local_file
            )
