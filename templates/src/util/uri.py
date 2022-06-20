import pathlib
from urllib.parse import urlparse


def is_uri(uri: str) -> bool:
    parsed = urlparse(uri)
    return bool(parsed.scheme and parsed.netloc)


def is_shepard_uri(uri: str) -> bool:
    if not is_uri(uri):
        return False
    return "/shepard/api/" in uri


def extract_filename_from_uri(file_url):
    parsed_url = urlparse(file_url)
    return pathlib.Path(parsed_url.path).name
