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


def test_change_directory():
    origin = os.getcwd()
    with change_directory(Path("/tmp")):
        assert os.getcwd() == "/tmp"
    assert origin == os.getcwd()
