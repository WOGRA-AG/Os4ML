from datetime import datetime

from kfp.v2.dsl import Input, Metrics
from src.jobmanager.solution import get_solution, put_solution
from src.util.date import FORMAT_STR
from src.util.error_handler import error_handler


@error_handler
def get_metrics(
    metrics: Input[Metrics],
    *,
    os4ml_namespace: str = "",
    solution_name: str = "",
) -> None:
    """Get the metrics from kubeflow and add them to the solution."""
    if "accuracy" in metrics.metadata:
        accuracy = metrics.metadata["accuracy"]
        solution = get_solution(solution_name, os4ml_namespace)
        if "metrics" not in solution or solution["metrics"] is None:
            solution["metrics"] = dict()
        solution["metrics"]["accuracy"] = accuracy
        solution["completionTime"] = datetime.utcnow().strftime(FORMAT_STR)
        put_solution(solution, solution_name, os4ml_namespace)
