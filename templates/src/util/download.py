from typing import IO

import requests

from config import USER_TOKEN


def download_file(url: str, output_file: IO[bytes], chunk_size=128) -> None:
    response = requests.get(
        url, stream=True, headers={"usertoken": USER_TOKEN}
    )
    for chunk in response.iter_content(chunk_size=chunk_size):
        output_file.write(chunk)
