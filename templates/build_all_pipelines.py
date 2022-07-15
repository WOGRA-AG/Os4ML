import importlib
import pathlib

if __name__ == '__main__':
    pipeline_dirs = (p for p in pathlib.Path("pipelines").iterdir()
                     if p.is_dir() and p.name != "__pycache__")
    for pipeline_dir in pipeline_dirs:
        try:
            module = importlib.import_module(f"pipelines.{pipeline_dir.name}.main")
            module.main()
        except ModuleNotFoundError as e:
            print(e)
            continue
