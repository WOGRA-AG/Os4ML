from typing import IO

import requests


def put_file_to_url(url: str, file: IO[bytes]) -> None:
    resp = requests.put(
        url, data=file, headers={"Content-Type": "application/octet-stream"}
    )
    assert 200 <= resp.status_code < 300
