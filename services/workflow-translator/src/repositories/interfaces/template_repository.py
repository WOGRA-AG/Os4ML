from typing import Protocol


class TemplateRepository(Protocol):
    def get_pipeline_template_by_name(self, name: str) -> str:
        ...
