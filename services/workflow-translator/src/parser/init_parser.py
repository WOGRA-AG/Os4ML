from src.parser import KubeflowParser
from src.parser.interfaces.parser import Parser
from src.services import WORKFLOW_ENGINE


def init_parser(engine: str = WORKFLOW_ENGINE) -> Parser:
    match engine:
        case "kubeflow" | "argo":
            return KubeflowParser()
        case _:
            raise NotImplementedError(
                f"Requested Engine {engine} is not supported"
            )
