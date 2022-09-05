from datetime import datetime

from build.jobmanager.model.solution import Solution
from util.date import DATE_FORMAT_STR
from util.init_jobmanager_client import init_jobmanager_client


def status_update(
    solution_name: str, new_status: str, os4ml_namespace: str
) -> Solution:
    jobmanager = init_jobmanager_client(os4ml_namespace)
    solution = jobmanager.get_solution(solution_name)
    solution.status = new_status
    jobmanager.put_solution(solution.name, solution=solution)
    return solution


def error_status_update(solution_name: str, os4ml_namespace: str) -> None:
    jobmanager = init_jobmanager_client(os4ml_namespace)
    solution = jobmanager.get_solution(solution_name)
    solution.status = "error"
    solution.completionTime = datetime.utcnow().strftime(DATE_FORMAT_STR)
    jobmanager.put_solution(solution.name, solution=solution)


def get_solution(solution_name: str, os4ml_namespace: str) -> Solution:
    jobmanager = init_jobmanager_client(os4ml_namespace)
    return jobmanager.get_solution(solution_name)


def put_solution(
    solution: Solution, solution_name: str, os4ml_namespace: str
) -> None:
    jobmanager = init_jobmanager_client(os4ml_namespace)
    jobmanager.put_solution(solution_name, solution=solution)
