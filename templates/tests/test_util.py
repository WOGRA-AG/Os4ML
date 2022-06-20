import os
from pathlib import Path

from util import change_directory


def test_change_directory():
    origin = os.getcwd()
    with change_directory(Path("/tmp")):
        assert os.getcwd() == "/tmp"
    assert origin == os.getcwd()
