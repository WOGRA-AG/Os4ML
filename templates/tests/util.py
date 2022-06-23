import contextlib
import os
from pathlib import Path


@contextlib.contextmanager
def change_directory(path: Path):
    before = Path().resolve()
    try:
        os.chdir(path)
        yield
    finally:
        os.chdir(before)
