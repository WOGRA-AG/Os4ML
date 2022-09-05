from datetime import datetime

from kfp.v2.dsl import Input, Metrics

from build.jobmanager.model.solution_metrics import SolutionMetrics
from jobmanager.solution import get_solution, put_solution
from pipelines.util import StatusMessages
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
    solution = get_solution(solution_name, os4ml_namespace)
    solution.status = StatusMessages.finished.value
    solution.completion_time = datetime.utcnow().strftime(DATE_FORMAT_STR)
    if "accuracy" in metrics.metadata:
        accuracy = metrics.metadata["accuracy"]
        if solution.metrics is None:
            solution.metrics = SolutionMetrics()
        solution.metrics.accuracy = accuracy
    print(solution)
    put_solution(solution, solution_name, os4ml_namespace)
