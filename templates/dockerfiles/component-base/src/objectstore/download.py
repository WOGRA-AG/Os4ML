from typing import BinaryIO

import requests


def download_file(url: str, output_file: BinaryIO, chunk_size=128) -> None:
    response = requests.get(url, stream=True)
    for chunk in response.iter_content(chunk_size=chunk_size):
        output_file.write(chunk)
