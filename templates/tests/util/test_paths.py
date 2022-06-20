import tempfile
from pathlib import Path

from src.util.paths import path_to_absolute
from tests.util import change_directory


def test_path_to_absolute():
    with tempfile.NamedTemporaryFile() as f:
        file_name = Path(f.name).name
        with change_directory(Path("/tmp/")):
            absolute = path_to_absolute(f"./{file_name}")
        assert absolute == f.name
