from datetime import datetime

from build.jobmanager.model.metrics import Metrics as SolutionMetrics
from jobmanager.solution import get_solution, put_solution
from kfp.v2.dsl import Input, Metrics
from util.date import DATE_FORMAT_STR
from util.error_handler import error_handler


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
        if solution.metrics is None:
            solution.metrics = SolutionMetrics()
        solution.metrics.accuracy = accuracy
        solution.completionTime = datetime.utcnow().strftime(DATE_FORMAT_STR)
        put_solution(solution, solution_name, os4ml_namespace)
