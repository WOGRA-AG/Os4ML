import pathlib


def path_to_absolute(rel_path: str):
    rel = pathlib.Path(rel_path)
    return str(rel.resolve())
