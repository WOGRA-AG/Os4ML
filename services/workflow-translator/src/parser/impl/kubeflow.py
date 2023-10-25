import enum
import json
from typing import Any, Generator, Optional

import yaml

from repositories import FS
from repositories.interfaces.template_repository import TemplateRepository
from services import (
    APPLY_NODE_SELECTOR,
    APPLY_NODE_TOLERATION,
    OS4ML_NAMESPACE_ENV,
    PREPARE_NODE_SELECTOR,
    PREPARE_NODE_TOLERATION,
    SOLVE_NODE_SELECTOR,
    SOLVE_NODE_TOLERATION,
    SOLVE_RESOURCE_REQUEST_CPU,
    SOLVE_RESOURCE_REQUEST_MEMORY,
    USER_TOKEN_ANNOTATION,
    USER_TOKEN_ENV,
)


class PipelineStep(str, enum.Enum):
    PREPARE = "prepare"
    SOLVE = "solve"
    APPLY = "apply"


def get_pipeline_step_by_name(name: str) -> PipelineStep:
    if name == "databag":
        return PipelineStep.PREPARE
    if name == "ludwig-solver":
        return PipelineStep.SOLVE
    if name == "prediction":
        return PipelineStep.APPLY
    raise ValueError(f"Cannot map pipeline with {name=} to a pipeline step")


def get_node_selector_by_pipeline_step(step: PipelineStep) -> dict | None:
    if step == PipelineStep.PREPARE:
        selector = PREPARE_NODE_SELECTOR
    elif step == PipelineStep.SOLVE:
        selector = SOLVE_NODE_SELECTOR
    elif step == PipelineStep.APPLY:
        selector = APPLY_NODE_SELECTOR
    if selector == "":
        return None
    return json.loads(selector)


def get_node_toleration_by_pipeline_step(step: PipelineStep) -> list | None:
    if step == PipelineStep.PREPARE:
        toleration = PREPARE_NODE_TOLERATION
    elif step == PipelineStep.SOLVE:
        toleration = SOLVE_NODE_TOLERATION
    elif step == PipelineStep.APPLY:
        toleration = APPLY_NODE_TOLERATION
    if toleration == "":
        return None
    obj = json.loads(toleration)
    if not isinstance(obj, list):
        obj = [obj]
    return obj


def _iter_containers(pipeline: dict) -> Generator[dict, None, None]:
    for container in pipeline["spec"]["templates"]:
        if "dag" not in container:
            yield container


class KubeflowParser:
    def __init__(
        self,
        repository: TemplateRepository = FS(),
        annotation: str = USER_TOKEN_ANNOTATION,
        user_token_env: dict[str, Any] = USER_TOKEN_ENV,
        os4ml_namespace_env: dict[str, str] = OS4ML_NAMESPACE_ENV,
    ):
        self.repository = repository
        self.annotation = annotation
        self.user_token_env = user_token_env
        self.os4ml_namespace_env = os4ml_namespace_env

    def get_pipeline_template_by_name(
        self, name: str, user_token: Optional[str] = None
    ) -> dict:
        template: str = self.repository.get_pipeline_template_by_name(
            name=name
        )
        pipeline: dict = yaml.safe_load(template)

        for container in _iter_containers(pipeline):
            self._update_user_token_env(container, user_token)
            self._set_os4ml_namespace(container)
            self._set_node_selectors_and_tolerations(name, container)
            self._add_resource_requests(name, container)

        return pipeline

    def _update_user_token_env(self, container: dict, user_token: str | None):
        if user_token is None:
            return
        container["metadata"]["annotations"][self.annotation] = user_token
        container["container"]["env"].append(self.user_token_env)

    def _set_os4ml_namespace(self, container: dict) -> None:
        container["container"]["env"].append(self.os4ml_namespace_env)

    def _set_node_selectors_and_tolerations(
        self, name: str, container: dict
    ) -> None:
        step = get_pipeline_step_by_name(name)
        selector = get_node_selector_by_pipeline_step(step)
        toleration = get_node_toleration_by_pipeline_step(step)

        if selector is not None:
            container["nodeSelector"] = selector
        if toleration is not None:
            container["tolerations"] = toleration

    def _add_resource_requests(self, name: str, container: dict) -> None:
        step = get_pipeline_step_by_name(name)
        if step == PipelineStep.SOLVE and (
            SOLVE_RESOURCE_REQUEST_CPU or SOLVE_RESOURCE_REQUEST_MEMORY
        ):
            requests = {}
            if SOLVE_RESOURCE_REQUEST_CPU:
                requests["cpu"] = SOLVE_RESOURCE_REQUEST_CPU
            if SOLVE_RESOURCE_REQUEST_MEMORY:
                requests["memory"] = SOLVE_RESOURCE_REQUEST_MEMORY
            container["container"]["resources"] = {
                "requests": requests,
            }
