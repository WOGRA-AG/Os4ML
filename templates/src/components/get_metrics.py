import functools
from datetime import datetime

from kfp.v2.dsl import Input, Metrics

from build.jobmanager.model.solution_metrics import SolutionMetrics
from jobmanager.solution import error_status_update, get_solution, put_solution
from model.error_msg_key import ErrorMsgKey
from pipelines.util import StatusMessages
from util.date import DATE_FORMAT_STR
from util.exception_handler import exception_handler


def get_metrics(
    metrics: Input[Metrics],
    solution_name: str,
    os4ml_namespace: str,
) -> None:
    """Get the metrics from kubeflow and add them to the solution."""
    handler = functools.partial(
        error_status_update, solution_name, os4ml_namespace=os4ml_namespace
    )
    with exception_handler(handler, ErrorMsgKey.METRICS_NOT_RETRIEVABLE):
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
