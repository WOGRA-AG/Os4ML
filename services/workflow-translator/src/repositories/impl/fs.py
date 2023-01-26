from pathlib import Path

from decorators.singleton_metaclass import Singleton
from exceptions.file_not_readable import FileNotReadableException
from exceptions.template_not_found import TemplateNotFoundException
from services import PIPELINE_FILE_NAME, PIPELINE_TEMPLATES_DIR


class FS(metaclass=Singleton):
    def __init__(
        self,
        pipeline_template_dir: str = PIPELINE_TEMPLATES_DIR,
        pipeline_file_name: str = PIPELINE_FILE_NAME,
    ):
        self.pipeline_template_dir = pipeline_template_dir
        self.pipeline_file_name = pipeline_file_name

    def get_pipeline_template_by_name(self, name: str) -> str:
        template_dir = Path(self.pipeline_template_dir, name)
        pipeline_file = template_dir / self.pipeline_file_name
        try:
            with open(pipeline_file, "r") as file:
                return file.read()
        except FileNotFoundError:
            raise TemplateNotFoundException(
                name=name, path=str(pipeline_file.resolve())
            )
        except OSError as e:
            raise FileNotReadableException(
                path=str(pipeline_file.resolve()), err=repr(e)
            )
