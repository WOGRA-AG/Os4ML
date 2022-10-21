from parser import KubeflowParser
from parser.interfaces.parser import Parser

from services import WORKFLOW_ENGINE


def init_parser(engine: str = WORKFLOW_ENGINE) -> Parser:
    match engine:
        case "kubeflow" | "argo":
            return KubeflowParser()
        case _:
            raise NotImplementedError(
                f"Requested Engine {engine} is not supported"
            )
