from datetime import datetime

from kfp.v2.dsl import Input, Metrics
from src.jobmanager.solution import (
    error_status_update,
    get_solution,
    put_solution,
)
from src.util.date import FORMAT_STR
from src.util.error_handler import error_handler


@error_handler(handler_func=error_status_update)
def get_metrics(metrics: Input[Metrics], solution_name: str = ""):
    """Get the metrics from kubeflow and add them to the solution."""
    if "accuracy" in metrics.metadata:
        accuracy = metrics.metadata["accuracy"]
        solution = get_solution(solution_name)
        if "metrics" not in solution or solution["metrics"] is None:
            solution["metrics"] = dict()
        solution["metrics"]["accuracy"] = accuracy
        solution["completionTime"] = datetime.utcnow().strftime(FORMAT_STR)
        put_solution(solution, solution_name)
