import tempfile
from pathlib import Path

from test_util import change_directory

from util.paths import path_to_absolute


def test_path_to_absolute():
    with tempfile.NamedTemporaryFile() as f:
        file_name = Path(f.name).name
        with change_directory(Path("/tmp/")):
            absolute = path_to_absolute(f"./{file_name}")
        assert absolute == f.name
