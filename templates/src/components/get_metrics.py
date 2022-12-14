import functools
from datetime import datetime

from kfp.v2.dsl import Input, Metrics

from build.model_manager_client.model.solution_metrics import SolutionMetrics
from config import DATE_FORMAT_STR
from model_manager.solutions import (
    get_solution_by_name,
    update_solution,
    update_solution_error_status,
)
from models.status_message import StatusMessage
from util.exception_handler import exception_handler


def get_metrics(
    metrics: Input[Metrics],
    solution_name: str,
) -> None:
    """Get the metrics from kubeflow and add them to the solution."""
    handler = functools.partial(
        update_solution_error_status,
        solution_name,
    )
    with exception_handler(handler, StatusMessage.METRICS_NOT_RETRIEVABLE):
        solution = get_solution_by_name(solution_name)
        solution.status = StatusMessage.SOLVER_DONE.value
        solution.completion_time = datetime.utcnow().strftime(DATE_FORMAT_STR)
        if solution.metrics is None:
            solution.metrics = SolutionMetrics()
        if "accuracy" in metrics.metadata:
            accuracy = metrics.metadata["accuracy"]
            solution.metrics.accuracy = float(accuracy)
        elif "r2_score" in metrics.metadata:
            r2_score = metrics.metadata["r2_score"]
            solution.metrics.accuracy = float(r2_score)
        update_solution(solution, solution_name)
