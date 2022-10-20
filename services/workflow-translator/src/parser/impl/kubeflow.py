from typing import Any, Dict

import yaml

from src.parser.interfaces.parser import Parser
from src.repositories import FS
from src.repositories.interfaces.template_repository import TemplateRepository
from src.services import USER_TOKEN_ANNOTATION, USER_TOKEN_ENV


class KubeflowParser(Parser):
    def __init__(
        self,
        repository: TemplateRepository = FS(),
        annotation: str = USER_TOKEN_ANNOTATION,
        user_token_env: Dict[str, Any] = USER_TOKEN_ENV,
    ):
        self.repository = repository
        self.annotation = annotation
        self.user_token_env = user_token_env

    def get_pipeline_template_by_name(
        self, name: str, user_token: str = None
    ) -> Dict:
        template: str = self.repository.get_pipeline_template_by_name(
            name=name
        )
        pipeline: Dict = yaml.safe_load(template)

        if user_token is None:
            return pipeline
        pipeline = self._update_user_token_env(pipeline, user_token)
        return pipeline

    def _update_user_token_env(self, pipeline, user_token: str) -> Dict:
        for container in pipeline["spec"]["templates"]:
            if "dag" in container:
                continue
            container["metadata"]["annotations"][self.annotation] = user_token
            container["container"]["env"].append(self.user_token_env)
        return pipeline
