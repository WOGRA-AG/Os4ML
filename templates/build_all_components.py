import importlib
import pathlib

if __name__ == '__main__':
    component_dirs = (d for d in pathlib.Path("components").iterdir()
                      if d.is_dir() and d.name != "__pycache__")
    for component_dir in component_dirs:
        try:
            module = importlib.import_module(f"components.{component_dir.name}.main")
            module.main()
        except ModuleNotFoundError as e:
            print(e)
            continue
