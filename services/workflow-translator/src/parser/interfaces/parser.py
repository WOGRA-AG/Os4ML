from typing import Protocol


class Parser(Protocol):
    def get_pipeline_template_by_name(
        self, name: str, user_token: str
    ) -> dict:
        ...
